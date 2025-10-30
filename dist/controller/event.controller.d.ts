import { NextFunction, Request, Response } from "express";
export declare class EventController {
    private eventService;
    constructor();
    createEvent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listEvents: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getEventById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateEvent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
