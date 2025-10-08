import { Events } from "@prisma/client";
import { CreateEventDTO } from "../dtos/createEvent.dto";

export interface EventService {
    createEvent(data:CreateEventDTO): Promise<Events>;
    getAllEvents():Promise<Events[]>;
    getEventById(id:number):Promise<Events | null>;
    approveEvent(id: number, message?: string): Promise<Events>;
    rejectEvent(id: number, message: string): Promise<Events>;
    getEventByName(title:string):Promise<Events | null>;
    updateEventTime(id: number, newDate: Date, newTime: Date): Promise<Events>;
    updateEvent(id:number, data:Partial<CreateEventDTO>):Promise<Events>;
    deleteEvent(id:number):Promise<void>
};