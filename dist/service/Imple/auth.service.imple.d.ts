import { User } from "@prisma/client";
import { CreateUserDTO } from "../../dtos/createUser.dto";
import { LoginDTO } from "../../dtos/login.dto";
import { AuthService } from "../auth.service";
import { RequestPasswordDTO, ResetPassword } from "../../dtos/resetPassword.dto";
import { ValidateOtpDTO } from "../../dtos/validateOtp.dto";
import { VerifyEmail } from "../../dtos/verifyEmail.dto";
export declare class AuthServiceImple implements AuthService {
    verify2FA(token: string, otp: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    resendOTP(email: string): Promise<void>;
    requestPasswordReset(data: RequestPasswordDTO): Promise<void>;
    validateOtp(data: ValidateOtpDTO): Promise<void>;
    resetPassword(data: ResetPassword): Promise<void>;
    verifyEmail(data: VerifyEmail): Promise<User>;
    login(data: LoginDTO): Promise<{
        message: string;
        tempToken?: string;
        accessToken?: string;
        refreshToken?: string;
    }>;
    createUser(data: CreateUserDTO): Promise<User>;
    private generateAccessToken;
    private generateRefreshToken;
}
