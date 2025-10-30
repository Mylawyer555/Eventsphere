import { NextFunction, Response } from "express";
import { CustomRequest } from "./auth.middleware";
declare const isAdmin: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
export default isAdmin;
