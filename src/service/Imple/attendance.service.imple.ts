import { Attendance, AttendanceStatus } from "@prisma/client";
import { AttendanceService } from "../attendance.service";
import { db } from "../../config/db";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../exceptions/customError.error";
import { getIO } from "../../socket";
import { eventQueue } from "../../jobs/queue";

const io = getIO()
export class AttendanceServiceImple implements AttendanceService {
    async markAttendance(eventId: number, participantId: number): Promise<Attendance> {
        const registration = await db.registration.findFirst({
            where:{
                Event_id: eventId,
                Student_id: participantId,
            },
        });

        if(!registration) {
            throw new CustomError(StatusCodes.BAD_REQUEST, "User not registered for this event");
        };

        //update attendance
        const attendance = await db.attendance.upsert({
           where:{
            Event_id_StudentId: {Event_id:eventId, StudentId:participantId}
           },
           update:{
            status:'PRESENT',
           },
           create:{
            Event_id:eventId,
            StudentId:participantId,
            status: AttendanceStatus.PRESENT,
            isAttended:true,
           }
        });

        //notify participant
        io.to(`User_${participantId}`).emit("attendance:marked", {
            eventId:attendance.Event_id,
            status: attendance.status,
        })

        //queue certificate generation async
        await eventQueue.add("generateCertificate", {
            eventId:attendance.Event_id,
            participantId: attendance.StudentId,
        });

        return attendance;
    }
    
}