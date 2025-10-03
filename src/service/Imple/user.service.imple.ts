
import { Prisma, Profile, Role, User } from "@prisma/client";
import { CreateUserDTO } from "../../dtos/createUser.dto";
import { UserService } from "../user.service";
import { db } from "../../config/db";
import { CustomError } from "../../exceptions/customError.error";
import { getIO } from "../../socket";
import redisClient from "../../redisClient";
import { StatusCodes } from "http-status-codes";
import { ProfileSummary, UserProfileSummary } from "../../exceptions/userProfile";

export class UserServiceImple implements UserService{
    async updateProfile(id: number, data: Partial<ProfileSummary>): Promise<ProfileSummary | null> {
        const isUserExist = await db.user.findUnique({where:{user_id:id}});
        if(!isUserExist){
            throw new CustomError(StatusCodes.NOT_FOUND,`No user found with id ${id}`)
        }

        const userProfile = await db.user.update({
            where:{
                user_id:id,
            },
            data:{
                firstname:data.firstname,
                lastName:data.lastName,
                email:data.email,
                role: data.role,
                profile : data.profile 
                    ? {
                        update: {
                            bio: data.profile.bio,
                            mobile_no: data.profile.mobile_no,
                            profile_picture: data.profile.profile_picture,
                            userName: data.profile.userName,
                        },
                    }
                    : undefined

            },
            select : {
                user_id : true,
                firstname: true,
                lastName: true,
                email : true,
                role: true,
                department: true,
                enrollment_number: true,
                isEmailVerified: true,
                created_at: true,
                updated_at: true,
                profile: {
                    select: {
                        bio:true,
                        mobile_no:true,
                        profile_picture: true,
                        created_at:true,
                        userName: true, // if it exists in your schema
                    },
                },
            }
,            
        });
        return userProfile

    };

    async updateProfilePix(id: number, data: Partial<Profile>): Promise<Profile | null> {
        throw new Error("Method not implemented.");
    }
    async getAllUsers(): Promise<User[]> {
        const cacheKey = `User:All`;

        // check cache first
        const cachedUser = await redisClient.get(cacheKey);
        if(cachedUser){
           return JSON.parse(cachedUser)
        };

        // if not in cache fetch from DB
        const user = await db.user.findMany();

        // store in cache 
        await redisClient.setex(cacheKey, 3600, JSON.stringify(user) )

        return user;
    }

    async getUserByRole(role:Role): Promise<User[]> {
        const cacheKey = `UserRole:${role}`;

        const cachedUser = await redisClient.get(cacheKey);
        if(cachedUser){
            return JSON.parse(cachedUser)  as User[]

        };

        const users = await db.user.findMany({
            where:{role},
            
        });

        //store in redis
        try {
            await redisClient.setex(cacheKey, 3600, JSON.stringify(users.map(({password, ...r}) =>r)));
        } catch (error) {
            console.error('Redis set error:',error)
        }
        
        return users
    }

    async updateUser(id: number, data: Partial<CreateUserDTO>): Promise<User> {
        const isUserExist = await db.user.findUnique({where:{user_id:id}});
        if(!isUserExist) {
            throw new CustomError(StatusCodes.NOT_FOUND, `No user found with id:${id}`)
        };

        const user = await db.user.update({
            where:{user_id:id},
            data,
        });

        // update redis 
        await redisClient.setex(`user:${id}`, 3600, JSON.stringify(user))

        return user;
    }
    async deleteUser(id: number): Promise<void> {
        const isUserExist = await db.user.findUnique({where:{user_id: id}});
        if(!isUserExist){
            throw new CustomError(StatusCodes.NOT_FOUND, 'user not found');
        };

        const deleteUser = await db.user.delete({
            where:{
                user_id:id,
            },
        });

        // remove from redis
        try {
            await redisClient.setex(`userId:${id}`, 3600, JSON.stringify(deleteUser))
        } catch (error) {
            console.error('Redis err:', error);
        }

        const io = getIO();
        io.emit('user deleted:',deleteUser.user_id )
    }
    async profile(id: number): Promise<UserProfileSummary | null> {
        return await db.user.findUnique({
            where: {
                user_id:id,
            },
            select: {
                user_id:true,
                firstname: true,
                lastName: true,
                email: true,
                role: true,
                department:true,
                enrollment_number:true,
                isEmailVerified: true,
                profile:{
                    select: {
                        profile_picture:true,
                        mobile_no: true,
                        userName: true,
                        bio: true,
                        created_at: true,
                    }
                }
            }
        }); 
    };

    async getUserById(id: number): Promise<User | null> {
        const cachedKey = `user:${id}`;

        //check redis cache first
        const cachedUser = await redisClient.get(cachedKey);
        if(cachedUser) {
            return JSON.parse(cachedUser);
        };

        //if not cached fetch from db
        const user = await db.user.findUnique({where : {user_id:id}});
        if(!user){
            throw new CustomError(StatusCodes.NOT_FOUND,`user with ${id} does not exist`)
        };

        // store in redis for the future
        await redisClient.setex(cachedKey, 3600, JSON.stringify(user));

        return user;
        
    };
    
    async createUser(data: CreateUserDTO): Promise<Omit<User, "password" | "role">> {
        const isUserExist = await db.user.findFirst({
            where:{email: data.email},
        });

        if(isUserExist){
            throw new CustomError(409,"Oops! email already in use")
        };

        const user = await db.user.create({
            data:{
                email:data.email,
                password: data.password,
                firstname:data.firstname,
                lastName: data.lastname,
                department: data.department,
                enrollment_number:data.enrollment_number,
                role: data.role,
            },
        });

        const {password, role, ...userWithoutpassword} = user

        const io = getIO();
        io.emit('user created', userWithoutpassword)
        return userWithoutpassword;
    }
   
   
   
    
}