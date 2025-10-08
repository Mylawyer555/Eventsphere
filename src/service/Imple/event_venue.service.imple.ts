import { Events_Venue } from "@prisma/client";
import { CreateVenueDTO } from "../../dtos/venue.dto";
import { EventVenueService } from "../eventvenue.service";

export class EventVenueServiceImple implements EventVenueService{
    addVenue(eventId: number, data: CreateVenueDTO): Promise<Events_Venue> {
        throw new Error("Method not implemented.");
    }
    updateVenue(venueId: number, data: Partial<CreateVenueDTO>): Promise<Events_Venue> {
        throw new Error("Method not implemented.");
    }
    deactivateVenue(venueId: number): Promise<Events_Venue> {
        throw new Error("Method not implemented.");
    }
    getVenueByEvent(eventId: number): Promise<Events_Venue[]> {
        throw new Error("Method not implemented.");
    }

}