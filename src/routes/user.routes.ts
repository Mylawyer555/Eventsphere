import { UserController } from "../controller/user.controller";
import express from "express"
import { validateMiddleware } from "../middleware/validationMiddleware.middleware";
import { CreateUserDTO } from "../dtos/createUser.dto";
import { authenticateUser } from "../middleware/auth.middleware";
import isAdmin from "../middleware/isAdmin.middleware";

const userController = new UserController();
const userRouter = express.Router();

userRouter.post("/", validateMiddleware(CreateUserDTO), userController.createUser);

userRouter.get('/:id', authenticateUser, userController.getUserById);

userRouter.get('/', authenticateUser, isAdmin, userController.getAllUsers);

userRouter.get('/role/:role', authenticateUser, userController.getUsersByRole);

userRouter.patch('/updateuser', authenticateUser, userController.updateUser);

userRouter.get('/auth/profile', authenticateUser, userController.profile);

userRouter.post('/suspend-user', authenticateUser, isAdmin, userController.suspendUser);

userRouter.post('/activate-user', authenticateUser, isAdmin, userController.activateUser);

userRouter.post('/promote-user', authenticateUser, isAdmin, userController.promoteUser);

userRouter.post('/demote-user', authenticateUser, isAdmin, userController.demoteUser);

userRouter.delete('/delete-user', authenticateUser, isAdmin, userController.deleteUser);



export default userRouter;