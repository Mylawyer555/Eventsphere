import express from 'express';
import { AuthController } from '../controller/auth.controller';
import { validateMiddleware } from '../middleware/validationMiddleware.middleware';
import { CreateUserDTO } from '../dtos/createUser.dto';
import { LoginDTO } from '../dtos/login.dto';
import { VerifyEmail } from '../dtos/verifyEmail.dto';
import { RequestPasswordDTO, ResetPassword } from '../dtos/resetPassword.dto';
import { ValidateOtpDTO } from '../dtos/validateOtp.dto';

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post('/sign-up',validateMiddleware(CreateUserDTO), authController.createUser);

authRouter.post('/login', validateMiddleware(LoginDTO), authController.login);

authRouter.post('/verify-2fa', authController.verify2fa) // where role !== participant

authRouter.post('/verify-email', validateMiddleware(VerifyEmail), authController.verifyEmail);

authRouter.post('/resend-otp', authController.resendOTP);

authRouter.post('/request-password-reset', validateMiddleware(RequestPasswordDTO), authController.requestPasswordReset);

authRouter.post('/validate-otp', validateMiddleware(ValidateOtpDTO), authController.validateOtp);

authRouter.post('/reset-password', validateMiddleware(ResetPassword), authController.resetPassword);

export default authRouter;