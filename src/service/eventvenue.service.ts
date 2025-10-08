import { Events_Venue } from "@prisma/client";
import { CreateVenueDTO } from "../dtos/venue.dto";

export interface EventVenueService {
  addVenue(eventId: number, data: CreateVenueDTO): Promise<Events_Venue>;
  updateVenue(venueId: number, data: Partial<CreateVenueDTO>): Promise<Events_Venue>;
  deactivateVenue(venueId: number): Promise<Events_Venue>;
  getVenueByEvent(eventId: number): Promise<Events_Venue[]>;
}
