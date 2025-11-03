import { Events } from "@prisma/client";
import { EventRegistrationService } from "../eventRegistration.service";
import { db } from "../../config/db";
import { CustomError } from "../../exceptions/customError.error";
import { StatusCodes } from "http-status-codes";
import { getIO } from "../../socket";


export class  EventRegistrationServiceImple implements EventRegistrationService {
    async registerEvent(userId: number, eventId: number): Promise<void> {
        const io = getIO()

        return await db.$transaction(async (tx) => {
            const event = await tx.events.findUnique({
                where:{Event_id: eventId},
            });

            if(!event) {
                throw new CustomError(StatusCodes.NOT_FOUND, "Event not found");
            };
            if(event.Approval_State !== "APPROVED"){
                throw new CustomError(StatusCodes.BAD_REQUEST,"Event not approved yet");
            };
            if(event.Status !== "UPCOMING"){
                throw new CustomError(StatusCodes.BAD_REQUEST, "Event registration is closed");
            };

            // avoid registration duplicates
            const regExist = await tx.registration.findFirst({
                where:{
                    Event_id:eventId,
                    Student_id:userId,
                },
            });

            if(regExist){
                throw new CustomError(StatusCodes.BAD_REQUEST, " You have already registered for this event");
            };

            // register the user
            await tx.registration.create({
                data:{
                    Event_id:eventId,
                    Student_id: userId,
                },
            });

            // update event registed count 
            await tx.events.update({
                where:{Event_id:eventId},
                data:{registered: {increment: 1}},
            });

            // Emit real-time notification
            io.emit("event:registered", {
                userId,
                eventId,
                message: "A new participant registered for your event!",
            });

            // ---->todo        // Queue background notifications (to organizer)  
        });
        
    };

    async getEventRegistered(userId: number): Promise<Events[]> {
        return await db.events.findMany({
            where:{
                Registration:{
                    some:{Student_id:userId},
                },
            },
            include:{Registration:true},
        });
    };

    async cancelUserRegistration(userId: number, eventId: number): Promise<void> {
        const io = getIO()

        return await db.$transaction(async(tx) =>{
            const registration= await tx.registration.findFirst({
                where:{
                    Student_id:userId,
                    Event_id:eventId,
                },
            });

            if(!registration){
                throw new CustomError(StatusCodes.NOT_FOUND, "You are not registered for this event");
            };

            //delete registration
            await tx.registration.delete({
                where:{
                    id: registration.id
                },
            });

            //decrease registered count
            await tx.events.update({
                where:{
                    Event_id:eventId,
                },
                data:{
                    registered:{
                        decrement:1
                    }
                },
            });

            io.emit("event:registrationCancelled", {
                userId,
                eventId,
                message:"A participant has cancelled registration"
            });
        });
    };
    
};