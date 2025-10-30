"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServiceImple = void 0;
const otp_util_1 = require("../../utils/otp.util");
const db_1 = require("../../config/db");
const customError_error_1 = require("../../exceptions/customError.error");
const password_util_1 = require("../../utils/password.util");
const Emails_1 = require("../../utils/Emails");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config/config"));
const socket_1 = require("../../socket");
const newOtp = (0, otp_util_1.generateOtp)();
class AuthServiceImple {
    async verify2FA(token, otp) {
        const decode = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
        if (decode.step !== "2FA_pending") {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid or Expired session');
        }
        ;
        const user = await db_1.db.user.findUnique({
            where: { user_id: decode.userId },
        });
        if (!user) {
            throw new customError_error_1.CustomError(404, 'User not found');
        }
        ;
        const isOtpValid = await (0, password_util_1.ComparePassword)(otp, user.otp);
        const isOtpExpired = user.otpExpiry < new Date();
        if (!isOtpValid || isOtpExpired) {
            throw new customError_error_1.CustomError(400, 'Invalid or expired otp');
        }
        ;
        // clear otp after verfication
        await db_1.db.user.update({
            where: { user_id: user.user_id },
            data: {
                otp: null,
                otpExpiry: null,
            },
        });
        const fullName = user.firstname + " " + user.lastName;
        const accessToken = this.generateAccessToken(user.user_id, fullName, user.role);
        const refreshToken = this.generateRefreshToken(user.user_id, fullName, user.role);
        return { accessToken, refreshToken };
    }
    async resendOTP(email) {
        const user = await db_1.db.user.findFirst({
            where: { email },
        });
        if (!user) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "No user found");
        }
        if (user.isEmailVerified) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_GATEWAY, "Email has already been verified");
        }
        const hashedOtp = await (0, password_util_1.HashPassword)(newOtp);
        await db_1.db.user.update({
            where: { user_id: user.user_id },
            data: {
                otp: hashedOtp,
                otpExpiry: (0, otp_util_1.generateOtpExpiry)(),
            },
        });
        await (0, Emails_1.sendOtpEmail)({
            to: user.email,
            subject: "Ypur new OTP",
            otp: newOtp,
        });
    }
    async requestPasswordReset(data) {
        const user = await db_1.db.user.findUnique({ where: { email: data.email } });
        if (!user) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, 'No user found');
        }
        ;
        if (!user.isEmailVerified) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email not verified, Please verify your email first');
        }
        ;
        const hashedOtp = await (0, password_util_1.HashPassword)(newOtp);
        await db_1.db.user.update({
            where: { user_id: user.user_id },
            data: {
                otp: hashedOtp,
                otpExpiry: (0, otp_util_1.generateOtpExpiry)(),
            },
        });
        await (0, Emails_1.sendOtpEmail)({
            to: user.email,
            subject: "Your new password reset OTP",
            otp: newOtp,
        });
    }
    ;
    async validateOtp(data) {
        const user = await db_1.db.user.findUnique({
            where: {
                email: data.email
            },
        });
        if (!user) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, 'user not found');
        }
        ;
        if (!user.otp || !user.otpExpiry) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'OTP verification not available for this user');
        }
        ;
        const isOtpValid = await (0, password_util_1.ComparePassword)(data.otp, user.otp);
        if (!isOtpValid) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid OTP');
        }
        ;
    }
    ;
    async resetPassword(data) {
        const user = await db_1.db.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, 'No user found with email');
        }
        ;
        const hashPass = await (0, password_util_1.HashPassword)(data.newPassword);
        await db_1.db.user.update({
            where: {
                email: data.email,
            },
            data: {
                otp: null,
                otpExpiry: null,
                password: hashPass,
            },
        });
    }
    async verifyEmail(data) {
        const user = await db_1.db.user.findFirst({
            where: { email: data.email },
        });
        if (!user) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "Email not found");
        }
        if (user.isEmailVerified) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Email already verified");
        }
        if (!user.otp || !user.otpExpiry) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "OTP is not available for this user");
        }
        const IsOtpValid = await (0, password_util_1.ComparePassword)(data.otp, user.otp);
        if (!IsOtpValid) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid OTP");
        }
        const isOtpExpiry = user.otpExpiry < new Date();
        if (isOtpExpiry) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "OTP is expired");
        }
        const regUser = await db_1.db.user.update({
            where: { user_id: user.user_id },
            data: {
                isEmailVerified: true,
                otp: null,
                otpExpiry: null,
            },
        });
        await (0, Emails_1.welcomeEmail)({
            to: regUser.email,
            subject: "Welcome to Eventsphere",
            name: regUser.firstname + " " + regUser.lastName,
        });
        return regUser;
    }
    async login(data) {
        const user = await db_1.db.user.findUnique({
            where: {
                email: data.email,
            },
        });
        if (!user) {
            throw new customError_error_1.CustomError(401, "Invalid email or password");
        }
        if (user.isSuspended) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Your account has been suspended. Please contact support");
        }
        ;
        const isPasswordValid = await (0, password_util_1.ComparePassword)(data.password, user.password);
        if (!isPasswordValid) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid email or password");
        }
        if (user.twoFactorEnabled) {
            const hashedOtp = await (0, password_util_1.HashPassword)(newOtp);
            await db_1.db.user.update({
                where: {
                    user_id: user.user_id,
                },
                data: {
                    otp: hashedOtp,
                    otpExpiry: (0, otp_util_1.generateOtpExpiry)(),
                },
            });
            await (0, Emails_1.sendOtpEmail)({
                to: user.email,
                subject: "Your login OTP",
                otp: newOtp,
            });
            const tempToken = jsonwebtoken_1.default.sign({ userId: user.user_id, step: '2FA_pending' }, config_1.default.jwt.secret, { expiresIn: '5m' });
            return { message: "Otp sent to your email", tempToken };
        }
        // if no 2FA enabled
        const fullName = user.firstname + " " + user.lastName;
        const accessToken = this.generateAccessToken(user.user_id, fullName, user.role);
        const refreshToken = this.generateRefreshToken(user.user_id, fullName, user.role);
        const io = (0, socket_1.getIO)();
        io.emit("user:login", {
            userId: user.user_id,
            role: user.role,
            timestamp: new Date(),
        });
        return { message: 'Login successful', accessToken, refreshToken };
    }
    async createUser(data) {
        const otp = (0, otp_util_1.generateOtp)();
        const isUserExist = await db_1.db.user.findUnique({
            where: {
                email: data.email,
            },
        });
        if (!isUserExist) {
            throw new customError_error_1.CustomError(409, "Oops! email already taken");
        }
        const hashedOtp = await (0, password_util_1.HashPassword)(otp);
        const maxRetries = 3;
        for (let attempts = 1; attempts <= maxRetries; attempts++) {
            try {
                return await db_1.db.$transaction(async (transaction) => {
                    const user = await transaction.user.create({
                        data: {
                            email: data.email,
                            password: data.password,
                            firstname: data.firstname,
                            lastName: data.lastname,
                            department: data.department,
                            enrollment_number: data.enrollment_number,
                            role: data.role,
                            otp: hashedOtp,
                            otpExpiry: (0, otp_util_1.generateOtpExpiry)(),
                            twoFactorEnabled: data.role !== "PARTICIPANT",
                        },
                    });
                    await (0, Emails_1.sendOtpEmail)({
                        to: data.email,
                        subject: "verify your email",
                        otp,
                    });
                    return user;
                });
            }
            catch (error) {
                console.warn(`retry ${attempts} due to transaction failure`, error);
                if (attempts === maxRetries) {
                    throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "failed to create user after multiple try");
                }
            }
        }
        throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Unexpected error occured during user creation");
    }
    generateAccessToken(userId, name, role) {
        const secret = config_1.default.jwt.secret;
        const expiresIn = config_1.default.jwt
            .expires;
        if (!secret) {
            throw Error("Jwt key not set");
        }
        const options = {
            expiresIn: config_1.default.jwt.expires,
        };
        return jsonwebtoken_1.default.sign({ user_id: userId, name, role }, secret, options);
    }
    generateRefreshToken(userId, name, role) {
        const secret = config_1.default.jwt.secret;
        const expiresIn = config_1.default.jwt
            .refresh_expires;
        if (!secret) {
            throw new Error("jwt key not set");
        }
        const options = {
            expiresIn: config_1.default.jwt.refresh_expires,
        };
        return jsonwebtoken_1.default.sign({ user_id: userId, name, role }, secret, options);
    }
}
exports.AuthServiceImple = AuthServiceImple;
