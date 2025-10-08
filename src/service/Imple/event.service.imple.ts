import { Events } from "@prisma/client";
import { CreateEventDTO } from "../../dtos/createEvent.dto";
import { EventService } from "../event.service";

export class EventServiceImple implements EventService {
    createEvent(data: CreateEventDTO): Promise<Events> {
        throw new Error("Method not implemented.");
    }
    getAllEvents(): Promise<Events[]> {
        throw new Error("Method not implemented.");
    }
    getEventById(id: number): Promise<Events | null> {
        throw new Error("Method not implemented.");
    }
    approveEvent(id: number, message?: string): Promise<Events> {
        throw new Error("Method not implemented.");
    }
    rejectEvent(id: number, message: string): Promise<Events> {
        throw new Error("Method not implemented.");
    }
    getEventByName(title: string): Promise<Events | null> {
        throw new Error("Method not implemented.");
    }
    updateEventTime(id: number, newDate: Date, newTime: Date): Promise<Events> {
        throw new Error("Method not implemented.");
    }
    updateEvent(id: number, data: Partial<CreateEventDTO>): Promise<Events> {
        throw new Error("Method not implemented.");
    }
    deleteEvent(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}