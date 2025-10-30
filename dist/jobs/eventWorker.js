"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const db_1 = require("../config/db");
const config_1 = __importDefault(require("../config/config"));
const connection = new ioredis_1.default({
    host: config_1.default.redis.host,
    port: config_1.default.redis.port,
});
const eventWorker = new bullmq_1.Worker("eventQueue", async (job) => {
    const { eventType, payload } = job.data;
    if (eventType === "EVENT_CREATED") {
        const { eventId, organizerId } = payload;
        console.log(`Processing EVENT_CREATED for event ${eventId}`);
        const event = await db_1.db.events.findUnique({
            where: {
                Event_id: eventId
            },
            include: {
                Organizer: true,
            },
        });
    }
});
