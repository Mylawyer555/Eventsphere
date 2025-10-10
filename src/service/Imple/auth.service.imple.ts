import { User } from "@prisma/client";
import { CreateUserDTO } from "../../dtos/createUser.dto";
import { LoginDTO } from "../../dtos/login.dto";
import { AuthService } from "../auth.service";
import { generateOtp, generateOtpExpiry } from "../../utils/otp.util";
import { db } from "../../config/db";
import { CustomError } from "../../exceptions/customError.error";
import { ComparePassword, HashPassword } from "../../utils/password.util";
import { sendOtpEmail, welcomeEmail } from "../../utils/Emails";
import { warn } from "console";
import { StatusCodes } from "http-status-codes";
import jwt, { SignOptions } from "jsonwebtoken";
import Configuration from "../../config/config";
import ms, { StringValue } from "ms";
import {
  RequestPasswordDTO,
  ResetPassword,
} from "../../dtos/resetPassword.dto";
import { ValidateOtpDTO } from "../../dtos/validateOtp.dto";
import { VerifyEmail } from "../../dtos/verifyEmail.dto";
import { getIO } from "../../socket";

const newOtp = generateOtp();
export class AuthServiceImple implements AuthService {
  async verify2FA(token: string, otp: string): Promise<{ accessToken: string; refreshToken: string; }> {
      const decode = jwt.verify(token, Configuration.jwt.secret) as {userId:number; step: string;}
      if(decode.step !== "2FA_pending") {
        throw new CustomError(StatusCodes.BAD_REQUEST,'Invalid or Expired session');
      };

      const user = await db.user.findUnique({
        where:{user_id : decode.userId},
      });

      if(!user) {
        throw new CustomError(404, 'User not found');
      };

      const isOtpValid = await ComparePassword(otp, user.otp!);
      const isOtpExpired = user.otpExpiry! < new Date();
      if(!isOtpValid || isOtpExpired){
        throw new CustomError(400,'Invalid or expired otp');
      };

      // clear otp after verfication

      await db.user.update({
        where:{user_id:user.user_id},
        data:{
          otp:null,
          otpExpiry:null,
        },
      });

      const fullName = user.firstname + " " + user.lastName;
      const accessToken = this.generateAccessToken(
        user.user_id,
        fullName,
        user.role
      );
      const refreshToken = this.generateRefreshToken(
        user.user_id,
        fullName,
        user.role
      );

      return {accessToken, refreshToken}
  }
  async resendOTP(email: string): Promise<void> {
    const user = await db.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, "No user found");
    }

    if (user.isEmailVerified) {
      throw new CustomError(
        StatusCodes.BAD_GATEWAY,
        "Email has already been verified"
      );
    }

    const hashedOtp = await HashPassword(newOtp);
    await db.user.update({
      where: { user_id: user.user_id },
      data: {
        otp: hashedOtp,
        otpExpiry: generateOtpExpiry(),
      },
    });

    await sendOtpEmail({
      to: user.email,
      subject: "Ypur new OTP",
      otp: newOtp,
    });
  }

  async requestPasswordReset(data: RequestPasswordDTO): Promise<void> {
    const user = await db.user.findUnique({ where: { email: data.email } });
    
    if(!user) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'No user found');
    };

    if(!user.isEmailVerified){
        throw new CustomError(StatusCodes.BAD_REQUEST,'Email not verified, Please verify your email first');
    };

    const hashedOtp = await HashPassword(newOtp);
    await db.user.update({
        where:{user_id:user.user_id},
        data:{
            otp: hashedOtp,
            otpExpiry: generateOtpExpiry(),
        },
    });

    await sendOtpEmail({
        to: user.email,
        subject: "Your new password reset OTP",
        otp: newOtp,
    });
    
  };

  async validateOtp(data: ValidateOtpDTO): Promise<void> {
    const user = await db.user.findUnique({
        where:{
            email:data.email
        },
    });

    if(!user) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'user not found')
    };

    if(!user.otp || !user.otpExpiry){
        throw new CustomError(
            StatusCodes.BAD_REQUEST,
            'OTP verification not available for this user'
        );
    };

    const isOtpValid = await ComparePassword(data.otp, user.otp);

    if(!isOtpValid) {
        throw new CustomError(
            StatusCodes.BAD_REQUEST,
            'Invalid OTP'
        );
    };
    
  };


  async resetPassword(data: ResetPassword): Promise<void> {
    const user = await db.user.findUnique({
        where:{email: data.email},
    });

    if(!user) {
        throw new CustomError(
            StatusCodes.NOT_FOUND,
            'No user found with email'
        );
    };

    const hashPass = await HashPassword(data.newPassword);
    await db.user.update({
        where:{
            email: data.email,
        },
        data:{
            otp: null,
            otpExpiry: null,
            password: hashPass,
        },
    });
  }
  async verifyEmail(data: VerifyEmail): Promise<User> {
    const user = await db.user.findFirst({
      where: { email: data.email },
    });

    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, "Email not found");
    }

    if (user.isEmailVerified) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "Email already verified");
    }

    if (!user.otp || !user.otpExpiry) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "OTP is not available for this user"
      );
    }

    const IsOtpValid = await ComparePassword(data.otp, user.otp);
    if (!IsOtpValid) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid OTP");
    }

    const isOtpExpiry = user.otpExpiry < new Date();

    if (isOtpExpiry) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "OTP is expired");
    }

    const regUser = await db.user.update({
      where: { user_id: user.user_id },
      data: {
        isEmailVerified: true,
        otp: null,
        otpExpiry: null,
      },
    });

    await welcomeEmail({
      to: regUser.email,
      subject: "Welcome to Eventsphere",
      name: regUser.firstname + " " + regUser.lastName,
    });

    return regUser;
  }
  async login(
    data: LoginDTO
  ): Promise<{message:string; tempToken?:string; accessToken?: string; refreshToken?: string }> {
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new CustomError(401, "Invalid email or password");
    }

    const isPasswordValid = await ComparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "Invalid email or password"
      );
    }
    if(user.twoFactorEnabled){
        const hashedOtp = await HashPassword(newOtp);

        await db.user.update({
            where:{
                user_id:user.user_id,
            },
            data:{
                otp: hashedOtp,
                otpExpiry: generateOtpExpiry(),
            },
        });

        await sendOtpEmail({
            to: user.email,
            subject: "Your login OTP",
            otp: newOtp,
        });

        const tempToken = jwt.sign(
            {userId: user.user_id, step:'2FA_pending'},
            Configuration.jwt.secret,
            {expiresIn: '5m'}
        );

        return {message:"Otp sent to your email", tempToken}
    }
   
    // if no 2FA enabled
    const fullName = user.firstname + " " + user.lastName;
    const accessToken = this.generateAccessToken(
      user.user_id,
      fullName,
      user.role
    );
    const refreshToken = this.generateRefreshToken(
      user.user_id,
      fullName,
      user.role
    );

    const io = getIO();
    io.emit("user:login",{
      userId: user.user_id,
      role: user.role,
      timestamp: new Date(),
    });

    return {message:'Login successful', accessToken, refreshToken };
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    const otp = generateOtp();
    const isUserExist = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!isUserExist) {
      throw new CustomError(409, "Oops! email already taken");
    }

    const hashedOtp = await HashPassword(otp);
    const maxRetries = 3;
    for (let attempts = 1; attempts <= maxRetries; attempts++) {
      try {
        return await db.$transaction(async (transaction) => {
          const user = await transaction.user.create({
            data: {
              email: data.email,
              password: data.password,
              firstname: data.firstname,
              lastName: data.lastname,
              department: data.department,
              enrollment_number: data.enrollment_number,
              role: data.role,
              otp: hashedOtp,
              otpExpiry: generateOtpExpiry(),
              twoFactorEnabled: data.role !== "PARTICIPANT",
            },
          });

          await sendOtpEmail({
            to: data.email,
            subject: "verify your email",
            otp,
          });
          return user;
        });
      } catch (error) {
        console.warn(`retry ${attempts} due to transaction failure`, error);
        if (attempts === maxRetries) {
          throw new CustomError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "failed to create user after multiple try"
          );
        }
      }
    }

    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Unexpected error occured during user creation"
    );
  }

  private generateAccessToken(
    userId: number,
    name: string,
    role: string
  ): string {
    const secret = Configuration.jwt.secret;
    const expiresIn: string | number = Configuration.jwt
      .expires as ms.StringValue;

    if (!secret) {
      throw Error("Jwt key not set");
    }

    const options: SignOptions = {
      expiresIn: Configuration.jwt.expires as ms.StringValue,
    };

    return jwt.sign({ user_id: userId, name, role }, secret, options);
  }

  private generateRefreshToken(
    userId: number,
    name: string,
    role: string
  ): string {
    const secret = Configuration.jwt.secret;
    const expiresIn: string | number = Configuration.jwt
      .refresh_expires as ms.StringValue;

    if (!secret) {
      throw new Error("jwt key not set");
    }

    const options: SignOptions = {
      expiresIn: Configuration.jwt.refresh_expires as ms.StringValue,
    };

    return jwt.sign({ user_id: userId, name, role }, secret, options);
  }
}
