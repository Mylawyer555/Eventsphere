import { UserController } from "../controller/user.controller";
import express from "express"

const userController = new UserController();
const userRouter = express.Router();

userRouter.post("/",userController.createUser);
userRouter.get('/:id', userController.getUserById);

userRouter.get('/', userController.getAllUsers)

userRouter.get('/role/:role', userController.getUsersByRole)

userRouter.patch('/updateuser', userController.updateUser)

userRouter.get('/auth/profile', userController.profile)


export default userRouter;