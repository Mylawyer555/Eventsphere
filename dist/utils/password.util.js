"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparePassword = exports.HashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 10;
const HashPassword = async (password) => {
    return await bcryptjs_1.default.hash(password, SALT_ROUNDS);
};
exports.HashPassword = HashPassword;
const ComparePassword = async (password, hashPassword) => {
    return await bcryptjs_1.default.compare(password, hashPassword);
};
exports.ComparePassword = ComparePassword;
