import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyEmail {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email! : string;

    @IsNotEmpty()
    @IsString()
    @Length(6,6)
    otp! : string;
}