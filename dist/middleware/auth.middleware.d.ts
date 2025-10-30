import { NextFunction, Request, Response } from "express";
export interface CustomRequest extends Request {
    userAuth?: {
        id: number;
        role: string;
    };
}
export declare const authenticateUser: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
