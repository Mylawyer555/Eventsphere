import { NextFunction, Request, Response } from "express";
import { UserServiceImple } from "../service/Imple/user.service.imple";
import { CreateUserDTO } from "../dtos/createUser.dto";
import { Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

export class UserController {
    private userService : UserServiceImple

    constructor(){
        this.userService = new UserServiceImple()
    }

    public createUser = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
            const userData = req.body as CreateUserDTO
            const newUser = await this.userService.createUser(userData);
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    };

    public getUserById = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
            const userId = parseInt(req.params.id)
            const user = await this.userService.getUserById(userId);
            if(!user) {
              res.status(201).json(user)
            }
        } catch (error) {
            next(error);
        }
    };

    public getAllUsers = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
            const users = await this.userService.getAllUsers();
           res.status(200).json(users)
        } catch (error) {
            next(error);
        }
    };
    public getUsersByRole = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
            const userRole = req.params.role.toUpperCase();
            if(!['ADMIN', 'PARTICIPANT','ORGANIZER'].includes(userRole)){
                res.status(400).json({error: 'invalid role provided'})
                return;
            }

            const users = await this.userService.getUserByRole(userRole as Role)
            res.status(200).json(users.map(({password, ...r}) => r))
           
        } catch (error) {
            next(error);
        }
    };

    public updateUser = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
            const userId = parseInt(req.params.id);
            const userData = req.body as Partial<CreateUserDTO>
            const updatedUser = await this.userService.updateUser(userId,userData)
           res.status(200).json(updatedUser)
        } catch (error) {
            next(error);
        }
    };
    public deleteUser = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
            const userId = parseInt(req.params.id);
            const deletedUser = await this.userService.deleteUser(userId)
           res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
    public profile = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
            const userId = parseInt(req.params.id);
            const userProfile = await this.userService.profile(userId);
           res.status(StatusCodes.OK).json({
            error: false,
            message: "User Profile Retrieved Successfully",
            data: userProfile,
           })
        } catch (error) {
            next(error);
        }
    };






};