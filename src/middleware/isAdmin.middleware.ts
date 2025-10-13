import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "./auth.middleware";
import { db } from "../config/db";
import { CustomError } from "../exceptions/customError.error";
import { Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";


const isAdmin = async(req:CustomRequest, res:Response, next:NextFunction):Promise<void> => {
    try {
        // req.userAuth obtains the id from the logged-in user
        const user = await db.user.findUnique({
            where:{user_id: Number(req.userAuth?.id)}
        });

        if(!user) {
            throw new CustomError(404, 'User not found');
        };

        if(user.role === Role.ADMIN){
            next();
        }else {
            throw new CustomError(StatusCodes.FORBIDDEN, 'Access denied');
        };

    } catch (error) {
        next(error);
    }
}

export default isAdmin