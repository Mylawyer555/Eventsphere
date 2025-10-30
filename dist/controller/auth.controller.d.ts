import { NextFunction, Request, Response } from "express";
export declare class AuthController {
    private authService;
    constructor();
    createUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verify2fa: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verifyEmail: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    resendOTP: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    requestPasswordReset: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    validateOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    resetPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
