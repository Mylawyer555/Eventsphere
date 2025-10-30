"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = __importDefault(require("./config/config"));
const redisClient = new ioredis_1.default({
    host: config_1.default.redis.host,
    port: config_1.default.redis.port,
    password: config_1.default.redis.password,
});
redisClient.on("connect", () => {
    console.log("Connected to Redis successfully");
});
redisClient.on("error", (error) => {
    console.error('Redis Error:', error);
});
exports.default = redisClient;
