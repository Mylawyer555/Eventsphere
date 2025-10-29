import { NextFunction, Request, Response } from "express";
import { EventServiceImple } from "../service/Imple/event.service.imple";
import { CreateEventDTO } from "../dtos/createEvent.dto";
import { StatusCodes } from "http-status-codes";


export class EventController {
    private eventService : EventServiceImple;

    constructor (){
        this.eventService = new EventServiceImple();
    };

    public createEvent = async(req:Request, res:Response, next:NextFunction):Promise<void> => {
        try {
            const organizerId = parseInt(req.params.id);
            const eventData = req.body as CreateEventDTO;
            const event = await this.eventService.createEvent(eventData, organizerId);

            res.status(StatusCodes.CREATED).json({
                error: false,
                message: "Event Created Successfully",
                data: event,
            })
        } catch (error) {
            next(error);
        }
    };
    public listEvents = async(req:Request, res:Response, next:NextFunction):Promise<void> => {
        try {
           const filter = {
            category : req.query.category,
            status: req.query.status,
            search: req.query.search,
            approvalState: req.query.approvalState,
           };
           const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
           const limit = req.query.limit ? Number(req.query.limit) : 10;

           const result = await this.eventService.listEvents(filter, cursor, limit);
           res.status(StatusCodes.OK).json({
            error: false,
            message: "Events fetched succeessfully",
            data: result,
           });
        } catch (error) {
            next(error);
        }
    };

    public getEventById =async(req:Request, res:Response, next:NextFunction):Promise<void> => {
        try {
            const eventId = parseInt(req.params.id);
            const event = await this.eventService.getEventById(eventId);
            res.status(StatusCodes.OK).json({
                error:false,
                message: "Event fetched successfully",
                data: event,
            });
        } catch (error) {
            next(error);
        }
    };

    public updateEvent = async(req: Request, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const eventId = parseInt(req.params.id);
             
        } catch (error) {
            
        }
    }



    
}