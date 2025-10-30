import { Event_Status, Events, Events_Venue } from "@prisma/client";
import { CreateEventDTO } from "../dtos/createEvent.dto";

export interface EventService {
    createEvent (data:CreateEventDTO, organizer_id:number):Promise<Events>;
    updateEvent(eventId:number, data:Partial<CreateEventDTO>, organizer_Id:number):Promise<Events>;
    getEventById(eventId:number):Promise<Events | null>;
    listEvents(filter?:any):Promise<Events[]>;
    reviewEvent(eventId: number, approved:boolean, adminId:number, message?:string):Promise<Events>;
    cancelEvent(eventId:number, organizerId:number):Promise<void>;
    deleteEvent(eventId: number, userId: number, role: string):Promise<void>;
    updateEventStatus(eventId:number, status: Event_Status): Promise<Events>;
    updateEventVenue(eventId:number, data:Partial<CreateEventDTO>, organizer_Id:number):Promise<Events>;
};