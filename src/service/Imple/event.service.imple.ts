import { Approval, Event_Status, Events, Role } from "@prisma/client";
import { CreateEventDTO } from "../../dtos/createEvent.dto";
import { EventService } from "../event.service";
import { db } from "../../config/db";
import { CustomError } from "../../exceptions/customError.error";
import { StatusCodes } from "http-status-codes";
import { getIO } from "../../socket";
import { create } from "ts-node";

const io = getIO();

export class EventServiceImple implements EventService {
  async updateEventStatus(eventId: number, status: Event_Status): Promise<Events> {
      const event = await db.events.findUnique({where:{Event_id:eventId}});

      if(!event) {
        throw new CustomError(StatusCodes.NOT_FOUND, "Event not found");
      };

      const updatedStatus = await db.events.update({
          where:{Event_id:eventId},
          data:{
              Status: status
            },
        });

        await db.outbox.create({
          data:{
              eventType: 'EVENT_STATUS_UPDATE',
              payload: JSON.stringify({
                  eventId: event.Event_id,
                  message: `Event ${updatedStatus.Status}`
              })
          }
        });

        return updatedStatus;


  };

  async updateEventVenue(eventId: number, data: Partial<CreateEventDTO>, organizer_Id: number): Promise<Events> {
    const event = await db.events.findUnique({where:{Event_id:eventId}});

    if(!event){
        throw new CustomError(StatusCodes.NOT_FOUND, "Event not found");
    };

    const updatedEvent = await db.events.update({
        where: {Event_id: eventId},
        data:{
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
        include: {Events_Venue: true},
    });

    await db.outbox.create({
        data:{
            eventType: "EVENT_VENUE_UPDATED",
            payload: JSON.stringify({
                eventId: updatedEvent.Event_id,
                organizer_Id: updatedEvent.organizerId,
            }),
        },

    });

    io.emit("event: venue update",
        {
            message: "Event venue updated successfully",
            eventId: updatedEvent.Event_id,
        }
    );

    return updatedEvent;

  }
  async deleteEvent(eventId: number, organizer_Id: number): Promise<void> {
    return await db.$transaction(async (tx) => {
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

  async createEvent(
    data: CreateEventDTO,
    organizer_id: number
  ): Promise<Events> {
    const organizer = await db.user.findUnique({
      where: { user_id: organizer_id },
    });

    if (!organizer) {
      throw new CustomError(StatusCodes.NOT_FOUND, "Organizer not found");
    }

    if (organizer.role !== Role.ORGANIZER) {
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        "Only organizers are permitted to create events"
      );
    }

    return await db.$transaction(async (tx) => {
      const event = await tx.events.create({
        data: {
          Title: data.title,
          Description: data.description,
          Category: data.category,
          Date: data.date,
          Time: data.time,
          bannerImage: data.bannerImage,
          maxParticipants: data.maxParticipants,
          Approval_State: Approval.PENDING,
          Status: Event_Status.UPCOMING,
          Organizer: { connect: { user_id: organizer_id } },
          Events_Venue: {
            create: data.venues.map((v) => ({
              Name: v.name,
              Address: v.address,
              isOnline: v.isOnline,
              Online_url: v.online_url,
              isActive: v.isActive ?? true,
            })),
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

  async listEvents(
    filter?: any,
    cursor?: number,                                                                                                                              
    limit = 10
  ): Promise<Events[]> {
    const whereClause: any = {};

    if (filter?.status) {
      whereClause.Status = filter.status;
    }

    if (filter?.category) {
      whereClause.Category = filter.category;
    }

    if (filter?.approvalState) {
      whereClause.Approval_State = filter.approvalState;
    }

    if (filter?.organizerId) {
      whereClause.organizerId = filter.organizerId;
    }

    if (filter?.search) {
      whereClause.OR = [
        { Title: { contains: filter.search, mode: "insensitive" } },
        { Description: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    const event = await db.events.findMany({
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

  async updateEvent(
    eventId: number,
    data: Partial<CreateEventDTO>,
    organizer_Id: number
  ): Promise<Events> {
    const event = await db.events.findUnique({
      where: { Event_id: eventId },
    });

    if (!event) {
      throw new CustomError(StatusCodes.NOT_FOUND, "Event not found");
    }

    if (event.organizerId !== organizer_Id) {
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        "You can only update your events"
      );
    }

    if (
      !([Approval.PENDING, Approval.REJECTED] as Approval[]).includes(
        event.Approval_State
      )
    ) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "Event cannot be modified after approval"
      );
    }

    return await db.$transaction(async (tx) => {
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

  };

  async getEventById(eventId: number): Promise<Events | null> {
    const event = await db.events.findUnique({
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
      throw new CustomError(StatusCodes.NOT_FOUND, "Event not found");
    }
    return event;
  }

  async reviewEvent(
    eventId: number,
    approved: boolean,
    adminId: number,
    message?: string
  ): Promise<Events> {
    const event = await db.events.findUnique({
      where: { Event_id: eventId },
    });

    if (!event) {
      throw new CustomError(StatusCodes.NOT_FOUND, "Event not found");
    }

    const updated = await db.events.update({
      where: { Event_id: eventId },
      data: {
        Approval_State: approved ? Approval.APPROVED : Approval.REJECTED,
        Approval_message: message ?? null,
      },
    });

    await db.outbox.create({
      data: {
        eventType: approved ? "EVENT_APPPROVED" : "EVENT_REJECTED",
        payload: JSON.stringify({ eventId, adminId }),
      },
    });

    return updated;
  }
}
