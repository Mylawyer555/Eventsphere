import { Department, Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty({message:"firstname is required "})
    @Length(2,50, {message:"firstname should not be less than two characters and more 50 characters"});
    firstname!: string;

    @IsNotEmpty()
    @Length(2,50)
    lastname!: string;

    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @Length(6, 20)
    password!: string;

    @IsNotEmpty()
    @IsEnum(Department)
    @IsString()
    department!: Department;

    @IsNotEmpty()
    @IsString()
    enrollment_number!: string;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(Role)
    role?: Role
}