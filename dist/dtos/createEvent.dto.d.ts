import { Events_Category } from "@prisma/client";
declare class VenueDTO {
    name: string;
    address?: string;
    isOnline: boolean;
    online_url?: string;
    isActive?: boolean;
}
export declare class CreateEventDTO {
    title: string;
    description?: string;
    category: Events_Category;
    date: string;
    time: string;
    bannerImage?: string;
    maxParticipants?: number;
    venues: VenueDTO[];
}
export {};
