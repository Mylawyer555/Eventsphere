"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServiceImple = void 0;
const client_1 = require("@prisma/client");
const db_1 = require("../../config/db");
const customError_error_1 = require("../../exceptions/customError.error");
const socket_1 = require("../../socket");
const redisClient_1 = __importDefault(require("../../redisClient"));
const http_status_codes_1 = require("http-status-codes");
class UserServiceImple {
    async suspendUser(id) {
        const user = await db_1.db.user.findUnique({ where: { user_id: id } });
        if (!user) {
            throw new customError_error_1.CustomError(404, 'user not found');
        }
        ;
        if (user.isSuspended) {
            throw new customError_error_1.CustomError(400, "User is suspended!");
        }
        ;
        return await db_1.db.user.update({
            where: { user_id: id },
            data: {
                isSuspended: true,
            },
        });
    }
    ;
    async activateUser(id) {
        const user = await db_1.db.user.findUnique({ where: { user_id: id } });
        if (!user)
            throw new customError_error_1.CustomError(404, 'User not found');
        if (!user.isSuspended) {
            throw new customError_error_1.CustomError(400, "User is already active");
        }
        ;
        return await db_1.db.user.update({
            where: { user_id: id },
            data: { isSuspended: false }
        });
    }
    ;
    async promoteUser(id, newRole) {
        const user = await db_1.db.user.findUnique({ where: { user_id: id } });
        if (!user) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, 'No user found');
        }
        ;
        if (user.role === newRole) {
            throw new customError_error_1.CustomError(400, 'User already has this role');
        }
        ;
        return await db_1.db.user.update({
            where: {
                user_id: id,
            },
            data: {
                role: newRole,
            }
        });
    }
    ;
    async demoteUser(id) {
        const user = await db_1.db.user.findUnique({
            where: { user_id: id },
        });
        if (!user) {
            throw new customError_error_1.CustomError(404, 'User not found');
        }
        ;
        if (user.role === client_1.Role.PARTICIPANT) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User is at the lowest role');
        }
        ;
        return await db_1.db.user.update({
            where: { user_id: id },
            data: { role: client_1.Role.PARTICIPANT },
        });
    }
    ;
    async updateProfile(id, data) {
        const isUserExist = await db_1.db.user.findUnique({ where: { user_id: id } });
        if (!isUserExist) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, `No user found with id ${id}`);
        }
        const userProfile = await db_1.db.user.update({
            where: {
                user_id: id,
            },
            data: {
                firstname: data.firstname,
                lastName: data.lastName,
                email: data.email,
                role: data.role,
                profile: data.profile
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
            select: {
                user_id: true,
                firstname: true,
                lastName: true,
                email: true,
                role: true,
                department: true,
                enrollment_number: true,
                isEmailVerified: true,
                created_at: true,
                updated_at: true,
                profile: {
                    select: {
                        bio: true,
                        mobile_no: true,
                        profile_picture: true,
                        created_at: true,
                        userName: true, // if it exists in your schema
                    },
                },
            },
        });
        return userProfile;
    }
    ;
    async updateProfilePix(id, data) {
        const user = await db_1.db.user.findUnique({ where: { user_id: id } });
        if (!user) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, `No user found with id ${id}`);
        }
        ;
        const userProfile = await db_1.db.profile.findUnique({ where: { user_id: id } });
        if (!userProfile) {
            throw new customError_error_1.CustomError(404, 'profile not found');
        }
        let updatedUserProfile;
        if (userProfile) {
            updatedUserProfile = await db_1.db.profile.update({
                where: {
                    user_id: id,
                },
                data: {
                    profile_picture: data.profile_picture,
                },
            });
        }
        return updatedUserProfile !== null && updatedUserProfile !== void 0 ? updatedUserProfile : null;
    }
    async getAllUsers() {
        const cacheKey = `User:All`;
        // check cache first
        const cachedUser = await redisClient_1.default.get(cacheKey);
        if (cachedUser) {
            return JSON.parse(cachedUser);
        }
        ;
        // if not in cache fetch from DB
        const user = await db_1.db.user.findMany();
        // store in cache 
        await redisClient_1.default.setex(cacheKey, 3600, JSON.stringify(user));
        return user;
    }
    async getUserByRole(role) {
        const cacheKey = `UserRole:${role}`;
        const cachedUser = await redisClient_1.default.get(cacheKey);
        if (cachedUser) {
            return JSON.parse(cachedUser);
        }
        ;
        const users = await db_1.db.user.findMany({
            where: { role },
        });
        //store in redis
        try {
            await redisClient_1.default.setex(cacheKey, 3600, JSON.stringify(users.map(({ password, ...r }) => r)));
        }
        catch (error) {
            console.error('Redis set error:', error);
        }
        return users;
    }
    async updateUser(id, data) {
        const isUserExist = await db_1.db.user.findUnique({ where: { user_id: id } });
        if (!isUserExist) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, `No user found with id:${id}`);
        }
        ;
        const user = await db_1.db.user.update({
            where: { user_id: id },
            data,
        });
        // update redis 
        await redisClient_1.default.setex(`user:${id}`, 3600, JSON.stringify(user));
        return user;
    }
    async deleteUser(id) {
        const isUserExist = await db_1.db.user.findUnique({ where: { user_id: id } });
        if (!isUserExist) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, 'user not found');
        }
        ;
        const deleteUser = await db_1.db.user.delete({
            where: {
                user_id: id,
            },
        });
        // remove from redis
        try {
            await redisClient_1.default.setex(`userId:${id}`, 3600, JSON.stringify(deleteUser));
        }
        catch (error) {
            console.error('Redis err:', error);
        }
        const io = (0, socket_1.getIO)();
        io.emit('user deleted:', deleteUser.user_id);
    }
    async profile(id) {
        return await db_1.db.user.findUnique({
            where: {
                user_id: id,
            },
            select: {
                user_id: true,
                firstname: true,
                lastName: true,
                email: true,
                role: true,
                department: true,
                enrollment_number: true,
                isEmailVerified: true,
                profile: {
                    select: {
                        profile_picture: true,
                        mobile_no: true,
                        userName: true,
                        bio: true,
                        created_at: true,
                    }
                }
            }
        });
    }
    ;
    async getUserById(id) {
        const cachedKey = `user:${id}`;
        //check redis cache first
        const cachedUser = await redisClient_1.default.get(cachedKey);
        if (cachedUser) {
            return JSON.parse(cachedUser);
        }
        ;
        //if not cached fetch from db
        const user = await db_1.db.user.findUnique({ where: { user_id: id } });
        if (!user) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, `user with ${id} does not exist`);
        }
        ;
        // store in redis for the future
        await redisClient_1.default.setex(cachedKey, 3600, JSON.stringify(user));
        return user;
    }
    ;
    async createUser(data) {
        const isUserExist = await db_1.db.user.findFirst({
            where: { email: data.email },
        });
        if (isUserExist) {
            throw new customError_error_1.CustomError(409, "Oops! email already in use");
        }
        ;
        const user = await db_1.db.user.create({
            data: {
                email: data.email,
                password: data.password,
                firstname: data.firstname,
                lastName: data.lastname,
                department: data.department,
                enrollment_number: data.enrollment_number,
                role: data.role,
            },
        });
        const { password, role, ...userWithoutpassword } = user;
        const io = (0, socket_1.getIO)();
        io.emit('user created', userWithoutpassword);
        return userWithoutpassword;
    }
}
exports.UserServiceImple = UserServiceImple;
