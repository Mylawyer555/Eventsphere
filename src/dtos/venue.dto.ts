import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateVenueDTO {
  @IsString()
  @IsNotEmpty()
  Name: string;

  @IsString()
  @IsOptional()
  Address?: string;

  @IsBoolean()
  @IsOptional()
  isOnline?: boolean;

  @IsUrl({}, { message: "Invalid online URL" })
  @IsOptional()
  Online_url?: string;
}
