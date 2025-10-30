import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middleware/auth.middleware";
export declare class UserController {
    private userService;
    constructor();
    createUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUsersByRole: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    profile: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
    suspendUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    activateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    promoteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    demoteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
