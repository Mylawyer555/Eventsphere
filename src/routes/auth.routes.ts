import express from 'express';
import { AuthController } from '../controller/auth.controller';

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post('/sign-up', authController.createUser);
authRouter.post('/login', authController.login);
authRouter.post('/verify-2fa', authController.verify2fa)
authRouter.post('/verify-email', authController.verifyEmail);
authRouter.post('/resend-otp', authController.resendOTP);
authRouter.post('/request-password-reset', authController.requestPasswordReset);
authRouter.post('/validate-otp', authController.validateOtp);
authRouter.post('/reset-password', authController.resetPassword);

export default authRouter;