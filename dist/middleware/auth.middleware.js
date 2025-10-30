"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const db_1 = require("../config/db");
;
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req === null || req === void 0 ? void 0 : req.headers['authorization'];
        if (!authHeader) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                message: 'Authorization is required',
            });
            return;
        }
        ;
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
        if (!token) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                message: "Token is missing from authorization header",
            });
            return;
        }
        const decode = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
        // fetch user from db to confirm if they still exist or active
        const user = await db_1.db.user.findUnique({
            where: { user_id: decode.id },
            select: { user_id: true, role: true, isSuspended: true, isActive: true },
        });
        if (!user) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                message: "user no longer exists",
            });
            return;
        }
        // check if user is suspended 
        if (user.isSuspended) {
            res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                message: "Your account is suspended. Please contact support",
            });
            return;
        }
        // check if user deactivated account 
        if (!user.isActive) {
            res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                message: "Your account is inactive. Please reactivate your account",
            });
            return;
        }
        // attach user info to request 
        req.userAuth = { id: user.user_id, role: user.role };
        next();
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR),
            error: error.message,
        });
    }
};
exports.authenticateUser = authenticateUser;
