import { NextFunction, Request, Response } from "express";
import { AttendanceServiceImple } from "../service/Imple/attendance.service.imple";

export class AttendanceController {
    private attendanceService : AttendanceServiceImple;

    constructor(){
        this.attendanceService = new AttendanceServiceImple();
    };

    public markAttendance = async (req:Request, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const {eventId, participantId} =  req.params;
            const event = parseInt(eventId);
            const participant= parseInt(participantId)

            const result = this.attendanceService.markAttendance(event, participant);
            res.status(200).json({message:"Attendance Marked", result})

        } catch (error) {
            next(error)
        }
    }
};

