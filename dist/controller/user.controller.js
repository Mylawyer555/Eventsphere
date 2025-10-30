"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_imple_1 = require("../service/Imple/user.service.imple");
const http_status_codes_1 = require("http-status-codes");
class UserController {
    constructor() {
        this.createUser = async (req, res, next) => {
            try {
                const userData = req.body;
                const newUser = await this.userService.createUser(userData);
                res.status(201).json(newUser);
            }
            catch (error) {
                next(error);
            }
        };
        this.getUserById = async (req, res, next) => {
            try {
                const userId = parseInt(req.params.id);
                const user = await this.userService.getUserById(userId);
                if (!user) {
                    res.status(201).json(user);
                }
            }
            catch (error) {
                next(error);
            }
        };
        this.getAllUsers = async (req, res, next) => {
            try {
                const users = await this.userService.getAllUsers();
                res.status(200).json(users);
            }
            catch (error) {
                next(error);
            }
        };
        this.getUsersByRole = async (req, res, next) => {
            try {
                const userRole = req.params.role.toUpperCase();
                if (!['ADMIN', 'PARTICIPANT', 'ORGANIZER'].includes(userRole)) {
                    res.status(400).json({ error: 'invalid role provided' });
                    return;
                }
                const users = await this.userService.getUserByRole(userRole);
                res.status(200).json(users.map(({ password, ...r }) => r));
            }
            catch (error) {
                next(error);
            }
        };
        this.updateUser = async (req, res, next) => {
            try {
                const userId = parseInt(req.params.id);
                const userData = req.body;
                const updatedUser = await this.userService.updateUser(userId, userData);
                res.status(200).json(updatedUser);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteUser = async (req, res, next) => {
            try {
                const userId = parseInt(req.params.id);
                const deletedUser = await this.userService.deleteUser(userId);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.profile = async (req, res, next) => {
            var _a;
            try {
                const userId = Number((_a = req.userAuth) === null || _a === void 0 ? void 0 : _a.id);
                const userProfile = await this.userService.profile(userId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    error: false,
                    message: "User Profile Retrieved Successfully",
                    data: userProfile,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.suspendUser = async (req, res, next) => {
            try {
                const userId = parseInt(req.params.id);
                const user = await this.userService.suspendUser(userId);
                res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
                    error: false,
                    message: "User has been suspended",
                    data: user,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.activateUser = async (req, res, next) => {
            try {
                const userId = parseInt(req.params.id);
                const user = await this.userService.activateUser(userId);
                res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
                    error: false,
                    message: "User has been activated successfully",
                    data: user,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.promoteUser = async (req, res, next) => {
            try {
                const userId = parseInt(req.params.id);
                const { newRole } = req.body;
                if (!newRole) {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        error: true,
                        message: "New role is required to promote user",
                    });
                    return;
                }
                ;
                const promtedUser = await this.userService.promoteUser(userId, newRole);
                res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
                    error: false,
                    message: `User has been promoted ${newRole}`,
                    data: promtedUser,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.demoteUser = async (req, res, next) => {
            try {
                const userId = parseInt(req.params.id);
                const user = await this.userService.demoteUser(userId);
                res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
                    error: false,
                    message: "User has been demoted successfully",
                    data: user,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.userService = new user_service_imple_1.UserServiceImple();
    }
}
exports.UserController = UserController;
;
