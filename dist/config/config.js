"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppEnvironment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var AppEnvironment;
(function (AppEnvironment) {
    AppEnvironment["DEVELOPMENT"] = "development";
    AppEnvironment["PRODUCTION"] = "production";
})(AppEnvironment || (exports.AppEnvironment = AppEnvironment = {}));
const Configuration = {
    redis: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
        password: process.env.REDIS_PASSWORD,
    },
    jwt: {
        secret: process.env.JWT_SECRET || '',
        expires: process.env.JWT_EXPIRES || '1h',
        refresh_expires: process.env.JWT_REFRESH_EXPIRES || '30 days'
    }
};
exports.default = Configuration;
