import { UserController } from "../controller/user.controller";
import express from "express"
import { validateMiddleware } from "../middleware/validationMiddleware.middleware";
import { CreateUserDTO } from "../dtos/createUser.dto";
import { authenticateUser } from "../middleware/auth.middleware";

const userController = new UserController();
const userRouter = express.Router();

userRouter.post("/", validateMiddleware(CreateUserDTO), userController.createUser);

userRouter.get('/:id', authenticateUser, userController.getUserById);

userRouter.get('/', authenticateUser, userController.getAllUsers);

userRouter.get('/role/:role', authenticateUser, userController.getUsersByRole);

userRouter.patch('/updateuser', authenticateUser, userController.updateUser);

userRouter.get('/auth/profile', authenticateUser, userController.profile);

userRouter.delete('/delete-user', authenticateUser, userController.deleteUser);


export default userRouter;