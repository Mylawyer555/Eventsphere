import { Profile, User,Role } from "@prisma/client"

export type UserProfileSummary = Pick<User, 'user_id' | 'email' | 'firstname' | 'lastName' | 'department' | 'enrollment_number' |'role' | 'isEmailVerified'> & {
    profile : Pick<
    Profile, 'profile_picture' | 'userName' | 'mobile_no'| 'bio' | 'created_at'
    > | null
}

// 🚀 Custom DTO type for response (no need to extend Prisma User)
export type ProfileSummary = {
  user_id: number;
  firstname: string;
  lastName: string;
  email: string;
  role: Role;
  profile: {
    created_at: Date;
    userName: string;
    profile_picture: string | null;
    bio: string | null;
    mobile_no: number;
  } | null;
};
