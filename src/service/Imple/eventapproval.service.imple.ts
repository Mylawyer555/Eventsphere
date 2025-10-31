import { Event_Status, Events } from "@prisma/client";
import { EventApprovalService } from "../eventapproval.service";
import { db } from "../../config/db";
import { CustomError } from "../../exceptions/customError.error";
import { StatusCodes } from "http-status-codes";
import { getIO } from "../../socket";
import { eventQueue } from "../../jobs/queue";

const io = getIO();

export class EventApprovalServiceImple implements EventApprovalService {
    async approveEvent(adminId: number, eventId: number, decision: "APPROVED" | "REJECTED", message?: string): Promise<Events> {
        const event = await db.events.findUnique({
            where:{
                Event_id:eventId,
            },
            include:{
                Organizer:true,
            },
        });

        if(!event) {
            throw new CustomError(StatusCodes.NOT_FOUND, "Event not found")
        };

        

        if(event.Approval_State !== "PENDING"){
            throw new CustomError(StatusCodes.BAD_REQUEST, "Event Already reviewed");
        };

        const updatedEvent = await db.$transaction(async (tx) => {
            const updated = await tx.events.update({
                where:{Event_id: eventId},
                data:{
                    Approval_State: decision,
                    Approval_message: message || null,
                    Status: decision === "APPROVED" ? Event_Status.UPCOMING : Event_Status.CANCELLED,
                },
                include: {
                    Organizer:true,
                }
            });

            // outbox entry
            await tx.outbox.create({
                data:{
                    eventType: "EVENT_REVIEWED",
                    payload: JSON.stringify({
                        eventId: updated.Event_id,
                        organizerId: updated.organizerId,
                        decision,
                        message,
                    }),
                },
            });
            return updated;
        });

        //emit socket.io event (real-time event)
        io.emit("event:reviewed", {
            eventId: updatedEvent.Event_id,
            status: updatedEvent.Approval_State,
        });

        //queue async notification with bullmq
        await eventQueue.add("sendNotification", {
            type: "EVENT_REVIEWED",
            data: {
                to: updatedEvent.Organizer.email,
                subject: `Your event ${updatedEvent.Title} has been ${decision.toLowerCase()}`,
                message: 
                decision === "APPROVED"
                ? "Your event has been approve and its now visible to participants"
                : `Your event was rejected. Reason: ${message || "No reason provided"}`
            },

        });
        return updatedEvent;
        
    };
    
};