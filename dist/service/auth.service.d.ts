import { User } from "@prisma/client";
import { CreateUserDTO } from "../dtos/createUser.dto";
import { LoginDTO } from "../dtos/login.dto";
import { VerifyEmail } from "../dtos/verifyEmail.dto";
import { RequestPasswordDTO, ResetPassword } from "../dtos/resetPassword.dto";
import { ValidateOtpDTO } from "../dtos/validateOtp.dto";
export interface AuthService {
    login(data: LoginDTO): Promise<{
        message: string;
        tempToken?: string;
        accessToken?: string;
        refreshToken?: string;
    }>;
    verify2FA(token: string, otp: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    createUser(data: CreateUserDTO): Promise<User>;
    verifyEmail(data: VerifyEmail): Promise<User>;
    resendOTP(email: string): Promise<void>;
    requestPasswordReset(data: RequestPasswordDTO): Promise<void>;
    validateOtp(data: ValidateOtpDTO): Promise<void>;
    resetPassword(data: ResetPassword): Promise<void>;
}
