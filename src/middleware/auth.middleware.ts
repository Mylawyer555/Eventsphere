import { NextFunction, Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from 'jsonwebtoken'
import Configuration from "../config/config";
import { db } from "../config/db";

export interface CustomRequest extends Request{
    userAuth?: {
        id: number,
        role: string,
    };
};

export const authenticateUser = async(req:CustomRequest, res:Response, next:NextFunction):Promise<void> => {
    try {
        const authHeader = req?.headers['authorization'];
        if(!authHeader) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Authorization is required',
            });
            return;
        };

        const token = authHeader?.split(" ")[1];
        if(!token){
            res.status(StatusCodes.UNAUTHORIZED).json({
                message:"Token is missing from authorization header",
            });
            return;
        }

        const decode = jwt.verify(
            token,
            Configuration.jwt.secret
        ) as JwtPayload & {id: number, role: string};

        // fetch user from db to confirm if they still exist or active
        const user = await db.user.findUnique({
            where:{user_id: decode.id},
            select:{user_id:true, role:true, isSuspended:true, isActive:true},
        });

        if(!user){
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "user no longer exists",
            });
            return;
        }

        // check if user is suspended 
        if(user.isSuspended){
            res.status(StatusCodes.FORBIDDEN).json({
                message:"Your account is suspended. Please contact support",
            });
            return;
        }

        // check if user deactivated account 
        if(!user.isActive){
            res.status(StatusCodes.FORBIDDEN).json({
                message:"Your account is inactive. Please reactivate your account",
            });
            return;
        }

        // attach user info to request 
        req.userAuth = {id: user.user_id, role: user.role};
        
        next();
    } catch (error:any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            error: error.message,
        });
    }
}