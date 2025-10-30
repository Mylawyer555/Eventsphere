"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventServiceImple = void 0;
const client_1 = require("@prisma/client");
const db_1 = require("../../config/db");
const customError_error_1 = require("../../exceptions/customError.error");
const http_status_codes_1 = require("http-status-codes");
const socket_1 = require("../../socket");
const io = (0, socket_1.getIO)();
class EventServiceImple {
    async updateEventStatus(eventId, status) {
        const event = await db_1.db.events.findUnique({ where: { Event_id: eventId } });
        if (!event) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "Event not found");
        }
        ;
        const updatedStatus = await db_1.db.events.update({
            where: { Event_id: eventId },
            data: {
                Status: status
            },
        });
        await db_1.db.outbox.create({
            data: {
                eventType: 'EVENT_STATUS_UPDATE',
                payload: JSON.stringify({
                    eventId: event.Event_id,
                    message: `Event ${updatedStatus.Status}`
                })
            }
        });
        return updatedStatus;
    }
    ;
    async updateEventVenue(eventId, data, organizer_Id) {
        const event = await db_1.db.events.findUnique({ where: { Event_id: eventId } });
        if (!event) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "Event not found");
        }
        ;
        const updatedEvent = await db_1.db.events.update({
            where: { Event_id: eventId },
            data: {
                Events_Venue: data.venues
                    ? {
                        deleteMany: {},
                        create: data.venues.map((v) => ({
                            Name: v.name,
                            Address: v.address,
                            isOnline: v.isOnline,
                            Online_url: v.online_url,
                            isActive: v.isActive,
                        })),
                    }
                    : undefined,
            },
            include: { Events_Venue: true },
        });
        await db_1.db.outbox.create({
            data: {
                eventType: "EVENT_VENUE_UPDATED",
                payload: JSON.stringify({
                    eventId: updatedEvent.Event_id,
                    organizer_Id: updatedEvent.organizerId,
                }),
            },
        });
        io.emit("event: venue update", {
            message: "Event venue updated successfully",
            eventId: updatedEvent.Event_id,
        });
        return updatedEvent;
    }
    async deleteEvent(eventId, organizer_Id) {
        return await db_1.db.$transaction(async (tx) => {
            const deletedEvent = await tx.events.delete({
                where: { Event_id: eventId },
            });
            await tx.outbox.create({
                data: {
                    eventType: "EVENT_DELETED",
                    payload: JSON.stringify({
                        eventId: deletedEvent.Event_id,
                        message: "Event deleted ",
                        organizer_Id: deletedEvent.organizerId,
                    }),
                    createdAt: new Date(),
                },
            });
        });
    }
    async createEvent(data, organizer_id) {
        const organizer = await db_1.db.user.findUnique({
            where: { user_id: organizer_id },
        });
        if (!organizer) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "Organizer not found");
        }
        if (organizer.role !== client_1.Role.ORGANIZER) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.FORBIDDEN, "Only organizers are permitted to create events");
        }
        return await db_1.db.$transaction(async (tx) => {
            const event = await tx.events.create({
                data: {
                    Title: data.title,
                    Description: data.description,
                    Category: data.category,
                    Date: data.date,
                    Time: data.time,
                    bannerImage: data.bannerImage,
                    maxParticipants: data.maxParticipants,
                    Approval_State: client_1.Approval.PENDING,
                    Status: client_1.Event_Status.UPCOMING,
                    Organizer: { connect: { user_id: organizer_id } },
                    Events_Venue: {
                        create: data.venues.map((v) => {
                            var _a;
                            return ({
                                Name: v.name,
                                Address: v.address,
                                isOnline: v.isOnline,
                                Online_url: v.online_url,
                                isActive: (_a = v.isActive) !== null && _a !== void 0 ? _a : true,
                            });
                        }),
                    },
                },
                include: {
                    Events_Venue: true,
                },
            });
            // recording the message in outbox
            await tx.outbox.create({
                data: {
                    eventType: "EVENT_CREATED",
                    payload: JSON.stringify({
                        eventId: event.Event_id,
                        title: event.Title,
                        organizerId: organizer_id,
                    }),
                    createdAt: new Date(),
                },
            });
            return event;
        });
    }
    async listEvents(filter, cursor, limit = 10) {
        const whereClause = {};
        if (filter === null || filter === void 0 ? void 0 : filter.status) {
            whereClause.Status = filter.status;
        }
        if (filter === null || filter === void 0 ? void 0 : filter.category) {
            whereClause.Category = filter.category;
        }
        if (filter === null || filter === void 0 ? void 0 : filter.approvalState) {
            whereClause.Approval_State = filter.approvalState;
        }
        if (filter === null || filter === void 0 ? void 0 : filter.organizerId) {
            whereClause.organizerId = filter.organizerId;
        }
        if (filter === null || filter === void 0 ? void 0 : filter.search) {
            whereClause.OR = [
                { Title: { contains: filter.search, mode: "insensitive" } },
                { Description: { contains: filter.search, mode: "insensitive" } },
            ];
        }
        const event = await db_1.db.events.findMany({
            where: whereClause,
            include: {
                Events_Venue: true,
                Organizer: {
                    select: { firstname: true, lastName: true, email: true },
                },
                Registration: true,
                MediaGallery: true,
            },
            take: limit,
            skip: cursor ? 1 : 0,
            ...(cursor && { cursor: { Event_id: cursor } }),
            orderBy: { Created_at: "asc" },
        });
        return event;
    }
    async updateEvent(eventId, data, organizer_Id) {
        const event = await db_1.db.events.findUnique({
            where: { Event_id: eventId },
        });
        if (!event) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "Event not found");
        }
        if (event.organizerId !== organizer_Id) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.FORBIDDEN, "You can only update your events");
        }
        if (![client_1.Approval.PENDING, client_1.Approval.REJECTED].includes(event.Approval_State)) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Event cannot be modified after approval");
        }
        return await db_1.db.$transaction(async (tx) => {
            const updatedEvent = await tx.events.update({
                where: { Event_id: eventId },
                data: {
                    Title: data.title,
                    Description: data.description,
                    Date: data.date,
                    Time: data.time,
                    bannerImage: data.bannerImage,
                    maxParticipants: data.maxParticipants,
                    Events_Venue: data.venues
                        ? {
                            deleteMany: {},
                            create: data.venues.map((v) => ({
                                Name: v.name,
                                Address: v.address,
                                isOnline: v.isOnline,
                                Online_url: v.online_url,
                                isActive: v.isActive,
                            })),
                        }
                        : undefined,
                },
                include: { Events_Venue: true },
            });
            // add to outbox for notifications
            await tx.outbox.create({
                data: {
                    eventType: "EVENT_UPDATED",
                    payload: JSON.stringify({
                        eventId: updatedEvent.Event_id,
                        organizer_Id: updatedEvent.organizerId,
                    }),
                },
            });
            io.emit("event:updated ", {
                message: "Event updated successfully ",
                eventId: updatedEvent.Event_id,
            });
            return updatedEvent;
        });
    }
    ;
    async getEventById(eventId) {
        const event = await db_1.db.events.findUnique({
            where: { Event_id: eventId },
            include: {
                Organizer: {
                    select: { user_id: true, firstname: true, lastName: true },
                },
                Events_Venue: true,
                MediaGallery: true,
                Feedback: { include: { student: true } },
                Registration: { include: { Student: true } },
            },
        });
        if (!event) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "Event not found");
        }
        return event;
    }
    async reviewEvent(eventId, approved, adminId, message) {
        const event = await db_1.db.events.findUnique({
            where: { Event_id: eventId },
        });
        if (!event) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "Event not found");
        }
        const updated = await db_1.db.events.update({
            where: { Event_id: eventId },
            data: {
                Approval_State: approved ? client_1.Approval.APPROVED : client_1.Approval.REJECTED,
                Approval_message: message !== null && message !== void 0 ? message : null,
            },
        });
        await db_1.db.outbox.create({
            data: {
                eventType: approved ? "EVENT_APPPROVED" : "EVENT_REJECTED",
                payload: JSON.stringify({ eventId, adminId }),
            },
        });
        return updated;
    }
}
exports.EventServiceImple = EventServiceImple;
