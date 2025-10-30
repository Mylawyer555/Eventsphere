"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_imple_1 = require("../service/Imple/auth.service.imple");
const http_status_codes_1 = require("http-status-codes");
class AuthController {
    constructor() {
        this.createUser = async (req, res, next) => {
            try {
                const userData = req.body;
                const user = await this.authService.createUser(userData);
                res.status(201).json({
                    error: false,
                    message: `Otp has been sent to your email @ ${user.email}`,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const loginData = req.body;
                const { accessToken, refreshToken } = await this.authService.login(loginData);
                res.status(200).json({
                    status: "success",
                    message: "Login successful",
                    data: {
                        accessToken,
                        refreshToken,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.verify2fa = async (req, res, next) => {
            try {
                const { token, otp } = req.body;
                const result = await this.authService.verify2FA(token, otp);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    error: false,
                    message: `two-factor verification successful`,
                    ...result,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.verifyEmail = async (req, res, next) => {
            try {
                const userData = req.body;
                const user = await this.authService.verifyEmail(userData);
                res.status(201).json({
                    error: false,
                    message: `You have successfully registered!`,
                    data: user,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.resendOTP = async (req, res, next) => {
            try {
                const { email } = req.body;
                if (!email) {
                    res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ error: true, message: "Email is required" });
                }
                const user = await this.authService.resendOTP(email);
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    error: false,
                    message: `OTP has been successfully sent`,
                    data: user,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.requestPasswordReset = async (req, res, next) => {
            try {
                const userData = req.body;
                await this.authService.requestPasswordReset(userData);
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    error: false,
                    message: `OTP has been successfully sent to ${userData.email}`,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.validateOtp = async (req, res, next) => {
            try {
                const userData = req.body;
                await this.authService.validateOtp(userData);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    error: false,
                    message: `OTP verified successfully`,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.resetPassword = async (req, res, next) => {
            try {
                const userData = req.body;
                await this.authService.resetPassword(userData);
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    error: false,
                    message: `Password has changed successful`,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.authService = new auth_service_imple_1.AuthServiceImple();
    }
}
exports.AuthController = AuthController;
