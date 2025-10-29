import { Worker } from "bullmq";
import Redis from "ioredis";
import { db } from "../config/db";
import Configuration from "../config/config";

const connection  = new Redis({
    host: Configuration.redis.host,
    port: Configuration.redis.port,
});


const eventWorker = new Worker(
    "eventQueue", async (job) =>{
        const {eventType, payload} = job.data;

        if(eventType === "EVENT_CREATED") {
            const {eventId, organizerId} = payload;

            console.log(`Processing EVENT_CREATED for event ${eventId}`)

            const event = await db.events.findUnique({
                where:{
                    Event_id : eventId
                },
                include:{
                    Organizer: true,
                },
            });
        }
    }
)