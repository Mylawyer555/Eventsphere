import { Event_Status, Events } from "@prisma/client";
import { CreateEventDTO } from "../../dtos/createEvent.dto";
import { EventService } from "../event.service";
export declare class EventServiceImple implements EventService {
    updateEventStatus(eventId: number, status: Event_Status): Promise<Events>;
    updateEventVenue(eventId: number, data: Partial<CreateEventDTO>, organizer_Id: number): Promise<Events>;
    deleteEvent(eventId: number, organizer_Id: number): Promise<void>;
    createEvent(data: CreateEventDTO, organizer_id: number): Promise<Events>;
    listEvents(filter?: any, cursor?: number, limit?: number): Promise<Events[]>;
    updateEvent(eventId: number, data: Partial<CreateEventDTO>, organizer_Id: number): Promise<Events>;
    getEventById(eventId: number): Promise<Events | null>;
    reviewEvent(eventId: number, approved: boolean, adminId: number, message?: string): Promise<Events>;
}
