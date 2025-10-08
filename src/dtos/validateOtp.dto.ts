import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ValidateOtpDTO{
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsString()
    @IsNotEmpty()
    otp: string;
}