import { Event_Status, Events, Events_Venue } from "@prisma/client";
import { CreateEventDTO } from "../dtos/createEvent.dto";

export interface EventService {
    createEvent (data:CreateEventDTO, organizer_id:number):Promise<Events>;
    updateEvent(eventId:number, data:Partial<CreateEventDTO>, organizer_Id:number):Promise<Events>;
    getEventById(eventId:number):Promise<Events | null>;
    listEvents(filter?:any):Promise<Events[]>;
    reviewEvent(eventId: number, approved:boolean, adminId:number, message?:string):Promise<Events>;
    deleteEvent(eventId:number, organizer_Id:number):Promise<void>;
    updateEventStatus(eventId:number, status: Event_Status): Promise<Events>;
    updateEventVenue(eventId:number, data:Partial<CreateEventDTO>, organizer_Id:number):Promise<Events>;
};