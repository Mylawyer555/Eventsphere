"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const event_service_imple_1 = require("../service/Imple/event.service.imple");
const http_status_codes_1 = require("http-status-codes");
class EventController {
    constructor() {
        this.createEvent = async (req, res, next) => {
            try {
                const organizerId = parseInt(req.params.id);
                const eventData = req.body;
                const event = await this.eventService.createEvent(eventData, organizerId);
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    error: false,
                    message: "Event Created Successfully",
                    data: event,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.listEvents = async (req, res, next) => {
            try {
                const filter = {
                    category: req.query.category,
                    status: req.query.status,
                    search: req.query.search,
                    approvalState: req.query.approvalState,
                };
                const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
                const limit = req.query.limit ? Number(req.query.limit) : 10;
                const result = await this.eventService.listEvents(filter, cursor, limit);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    error: false,
                    message: "Events fetched succeessfully",
                    data: result,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getEventById = async (req, res, next) => {
            try {
                const eventId = parseInt(req.params.id);
                const event = await this.eventService.getEventById(eventId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    error: false,
                    message: "Event fetched successfully",
                    data: event,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateEvent = async (req, res, next) => {
            try {
                const eventId = parseInt(req.params.id);
            }
            catch (error) {
            }
        };
        this.eventService = new event_service_imple_1.EventServiceImple();
    }
    ;
}
exports.EventController = EventController;
