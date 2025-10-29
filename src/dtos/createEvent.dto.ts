// dto/create-event.dto.ts
import {
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  ValidateNested,
  ArrayMinSize,
  IsBoolean,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { Events_Category } from "@prisma/client";

class VenueDTO {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsBoolean()
  isOnline!: boolean;

  @IsOptional()
  @IsString()
  online_url?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateEventDTO {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Events_Category)
  @IsString()
  @IsOptional()
  category!: Events_Category;

  @IsDateString()
  date!: string;

  @IsDateString()
  time!: string;

  @IsOptional()
  @IsString()
  bannerImage?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxParticipants?: number;

  @ValidateNested({ each: true })
  @Type(() => VenueDTO)
  @ArrayMinSize(1)
  venues!: VenueDTO[];
}
