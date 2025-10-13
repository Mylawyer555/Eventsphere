import { NextFunction, Request, Response } from "express";
import { AuthServiceImple } from "../service/Imple/auth.service.imple";
import { CreateUserDTO } from "../dtos/createUser.dto";
import { LoginDTO } from "../dtos/login.dto";
import { VerifyEmail } from "../dtos/verifyEmail.dto";
import { StatusCodes } from "http-status-codes";
import { RequestPasswordDTO, ResetPassword } from "../dtos/resetPassword.dto";
import { ValidateOtpDTO } from "../dtos/validateOtp.dto";

export class AuthController {
  private authService: AuthServiceImple;

  constructor() {
    this.authService = new AuthServiceImple();
  }

  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData = req.body as CreateUserDTO;
      const user = await this.authService.createUser(userData);
      res.status(201).json({
        error: false,
        message: `Otp has been sent to your email @ ${user.email}`,
      });
    } catch (error) {
      next(error);
    }
  };
  
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const loginData = req.body as LoginDTO;
      const { accessToken, refreshToken } =
        await this.authService.login(loginData);
      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public verify2fa = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { token, otp } = req.body;
      const result = await this.authService.verify2FA(token, otp);
      res.status(StatusCodes.OK).json({
        error: false,
        message: `two-factor verification successful`,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData = req.body as VerifyEmail;
      const user = await this.authService.verifyEmail(userData);
      res.status(201).json({
        error: false,
        message: `You have successfully registered!`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  public resendOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body;
      if (!email) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: true, message: "Email is required" });
      }
      const user = await this.authService.resendOTP(email);
      res.status(StatusCodes.CREATED).json({
        error: false,
        message: `OTP has been successfully sent`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  public requestPasswordReset = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData = req.body as RequestPasswordDTO;
      await this.authService.requestPasswordReset(userData);
      res.status(StatusCodes.CREATED).json({
        error: false,
        message: `OTP has been successfully sent to ${userData.email}`,
      });
    } catch (error) {
      next(error);
    }
  };

  public validateOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData = req.body as ValidateOtpDTO;
      await this.authService.validateOtp(userData);
      res.status(StatusCodes.OK).json({
        error: false,
        message: `OTP verified successfully`,
      });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData = req.body as ResetPassword;
      await this.authService.resetPassword(userData);
      res.status(StatusCodes.CREATED).json({
        error: false,
        message: `Password has changed successful`,
      });
    } catch (error) {
      next(error);
    }
  };
}
