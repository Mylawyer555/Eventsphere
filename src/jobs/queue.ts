import {Queue} from 'bullmq';
import Redis from 'ioredis'
import Configuration from '../config/config';

const connection = new Redis({
    host: Configuration.redis.host,
    port: Configuration.redis.port,
});

export const eventQueue = new Queue("eventQueue", {connection});