import { Department, Role } from "@prisma/client";
import { Escape, NormalizeEmail, Trim } from "class-sanitizer";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty({message:"firstname is required "})
    @Length(2,50, {message:"firstname should not be less than two characters and more 50 characters"})
    @Trim()
    @Escape()
    firstname!: string;

    @IsNotEmpty()
    @Length(2,50)
    @Trim()
    @Escape()
    lastname!: string;

    @IsNotEmpty()
    @IsEmail()
    @NormalizeEmail()
    @Trim()
    email!: string;

    @IsNotEmpty()
    @Length(6, 20)
    @Trim()
    password!: string;

    @IsNotEmpty()
    @IsEnum(Department)
    @IsString()
    @Trim()
    department!: Department;

    @IsNotEmpty()
    @IsString()
    @Trim()
    enrollment_number!: string;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(Role)
    role?: Role
}