import { IsBoolean, IsInt, Min } from "class-validator";

export class CreateSeatingDTO {
  @IsInt()
  @Min(1)
  total_Seats: number;

  @IsBoolean()
  isWaitlist_Enabled: boolean;
}
