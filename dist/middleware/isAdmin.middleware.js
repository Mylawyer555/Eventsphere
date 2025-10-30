"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const customError_error_1 = require("../exceptions/customError.error");
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const isAdmin = async (req, res, next) => {
    var _a;
    try {
        // req.userAuth obtains the id from the logged-in user
        const user = await db_1.db.user.findUnique({
            where: { user_id: Number((_a = req.userAuth) === null || _a === void 0 ? void 0 : _a.id) }
        });
        if (!user) {
            throw new customError_error_1.CustomError(404, 'User not found');
        }
        ;
        if (user.role === client_1.Role.ADMIN) {
            next();
        }
        else {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.FORBIDDEN, 'Access denied');
        }
        ;
    }
    catch (error) {
        next(error);
    }
};
exports.default = isAdmin;
