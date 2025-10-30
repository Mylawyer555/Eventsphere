import { Department, Role } from "@prisma/client";
export declare class CreateUserDTO {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    department: Department;
    enrollment_number: string;
    role?: Role;
}
