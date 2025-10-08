import { IsEmail, IsNotEmpty, IsString, Length} from "class-validator";

export class RequestPasswordDTO {
    @IsEmail()
    @IsNotEmpty()
    email : string;
}

export class ResetPassword{
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    @IsString()
    @Length(6,20)
    newPassword: string;
}