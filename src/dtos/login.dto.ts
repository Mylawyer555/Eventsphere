import { Trim } from "class-sanitizer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
    @IsNotEmpty()
    @IsEmail()
    @Trim()
    email!: string;

    @IsNotEmpty()
    @IsString()
    @Trim()
    password!: string;
}