import { CreateUserDTO } from "../dtos/createUser.dto";
import { Profile, Role, User } from "@prisma/client";
import { ProfileSummary, UserProfileSummary } from "../exceptions/userProfile";


export interface UserService {
    createUser(data: CreateUserDTO):Promise<Omit<User, "password" | "role">>
    getUserById(id:number):Promise<User | null>
    getAllUsers():Promise<User[]>;
    getUserByRole(role:Role): Promise<User[]>;
    updateUser(id:number, data: Partial<CreateUserDTO>): Promise<User>
    deleteUser(id:number): Promise<void>;
    profile(id:number): Promise<UserProfileSummary | null>;
    updateProfile(id: number, data: Partial<ProfileSummary>): Promise<ProfileSummary | null>  
    updateProfilePix(id:number, data: Partial<Profile>) : Promise<Profile | null>

}