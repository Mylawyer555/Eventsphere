import { Events } from "@prisma/client";

export interface EventRegistrationService {
    registerEvent(userId:number, eventId:number):Promise<void>;
    getEventRegistered(userId:number):Promise<Events[]>;
    cancelUserRegistration(userId:number, eventId:number):Promise<void>;
};