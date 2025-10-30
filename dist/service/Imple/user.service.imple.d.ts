import { Profile, Role, User } from "@prisma/client";
import { CreateUserDTO } from "../../dtos/createUser.dto";
import { UserService } from "../user.service";
import { ProfileSummary, UserProfileSummary } from "../../exceptions/userProfile";
export declare class UserServiceImple implements UserService {
    suspendUser(id: number): Promise<User>;
    activateUser(id: number): Promise<User>;
    promoteUser(id: number, newRole: Role): Promise<User>;
    demoteUser(id: number): Promise<User>;
    updateProfile(id: number, data: Partial<ProfileSummary>): Promise<ProfileSummary | null>;
    updateProfilePix(id: number, data: Partial<Profile>): Promise<Profile | null>;
    getAllUsers(): Promise<User[]>;
    getUserByRole(role: Role): Promise<User[]>;
    updateUser(id: number, data: Partial<CreateUserDTO>): Promise<User>;
    deleteUser(id: number): Promise<void>;
    profile(id: number): Promise<UserProfileSummary | null>;
    getUserById(id: number): Promise<User | null>;
    createUser(data: CreateUserDTO): Promise<Omit<User, "password" | "role">>;
}
