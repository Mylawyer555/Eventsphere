import { IsDateString, IsEnum, IsNotEmpty, IsString, Matches } from "class-validator";
import { Events_Category } from "@prisma/client";

export class CreateEventDTO {
  @IsString()
  @IsNotEmpty({ message: "Title of the event is required" })
  Title: string;

  @IsString()
  @IsNotEmpty({ message: "Description is required" })
  Description: string;

  @IsEnum(Events_Category)
  @IsNotEmpty({ message: "Category is required" })
  Category: Events_Category;
  
  @IsDateString()
  @IsNotEmpty({ message: "Event date is required" })
  Date: Date;

  @IsDateString()
  Time: string;

  @IsString()
  @IsNotEmpty({ message: "Venue is required" })
  Event_venue: string;

  @IsNotEmpty({ message: "Organizer ID is required" })
  Organizer_id: number;
};
