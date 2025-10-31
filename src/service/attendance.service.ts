import { Attendance } from "@prisma/client";

export interface AttendanceService {
    markAttendance(eventId:number, participantId:number):Promise<Attendance>;
};