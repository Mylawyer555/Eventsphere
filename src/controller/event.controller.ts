import { NextFunction, Request, Response } from "express";
import { EventServiceImple } from "../service/Imple/event.service.imple";
import { CreateEventDTO } from "../dtos/createEvent.dto";
import { StatusCodes } from "http-status-codes";
import { CustomRequest } from "../middleware/auth.middleware";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CustomError } from "../exceptions/customError.error";
import { Event_Status } from "@prisma/client";


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

    public updateEvent = async(req: CustomRequest, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const eventId = parseInt(req.params.id);
            const organizerId = req.userAuth?.id!;
            const dto = plainToInstance(CreateEventDTO, req.body);
            const error = await validate(dto);
            if(error.length > 0){
                throw new CustomError(StatusCodes.BAD_REQUEST,"Invalid event data")
            }
            
            const updatedEvent = await this.eventService.updateEvent(eventId,dto, organizerId);
            res.status(StatusCodes.OK).json({
                error: false,
                message:"Event updated successfully",
                data: updatedEvent,
            })
        } catch (error) {
            next(error)
        }
    };

    public reviewEvent = async (req: CustomRequest, res:Response, next:NextFunction):Promise<void>=>{
        try {
            const adminId = req.userAuth?.id!;
            const eventId = parseInt(req.params.id);
            const {approved, message} = req.body;

            const updated = await this.eventService.reviewEvent(eventId, approved, adminId, message);
            res.status(StatusCodes.OK).json({
                error:false,
                message: approved ? "Event approved successfully" : "Event rejected",
                data: updated,
            })
        } catch (error) {
            next(error);
        }
    };
    
    public deleteEvent = async (req: CustomRequest, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const eventId = parseInt(req.params.id);
            const userId = req.userAuth?.id!;
            const role = req.userAuth?.role!;

           await this.eventService.deleteEvent(eventId, userId, role);
           res.status(StatusCodes.NO_CONTENT).json({
                error: false,
                message: "Event deleted successfully"
           })
        } catch (error) {
            next(error);
        }
    };

    public cancelEvent = async (req: CustomRequest, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const organizerId = req.userAuth?.id!;
            const eventId = parseInt(req.params.id);
            

           await this.eventService.cancelEvent(eventId, organizerId)
           res.status(StatusCodes.OK).json({
                error: false,
                message: "Event cancelled successfully"
           })
        } catch (error) {
            next(error);
        }
    };

    public updateEventStatus = async(req:Request, res:Response, next:NextFunction):Promise<void> => {
        try {
            const eventId = parseInt(req.params.id);
            const {status} = req.body

            if(!eventId || !status) {
                throw new CustomError(StatusCodes.BAD_REQUEST, "Event ID and status required");
            };

            if(!Object.values(Event_Status).includes(status)) {
                throw new CustomError(400, "Invalid event status");
            };

            const updatedEvent = await this.eventService.updateEventStatus(eventId, status as Event_Status)

            res.status(StatusCodes.OK).json({
                error: false,
                message: "Event Status updated Successfully",
                data: updatedEvent,
            });
        } catch (error) {
            next(error);
        }
    };

    public updateEventVenue = async(req:CustomRequest, res:Response, next:NextFunction):Promise<void> => {
        try {
            const eventId = parseInt(req.params.id);
            const organizerId = req.userAuth?.id!;
            const data = req.body


            if(!eventId || !organizerId) {
                throw new CustomError(StatusCodes.BAD_REQUEST, "Missing eventId or organizerId");
            };

            
            const updatedEvent = await this.eventService.updateEventVenue(eventId, data, organizerId)

            res.status(StatusCodes.OK).json({
                error: false,
                message: "Event Venue updated Successfully",
                data: updatedEvent,
            });
        } catch (error) {
            next(error);
        }
    };

};