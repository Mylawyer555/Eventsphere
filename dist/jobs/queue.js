"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventQueue = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = __importDefault(require("../config/config"));
const connection = new ioredis_1.default({
    host: config_1.default.redis.host,
    port: config_1.default.redis.port,
});
exports.eventQueue = new bullmq_1.Queue("eventQueue", { connection });
