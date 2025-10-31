import  express  from "express";
import { AttendanceController } from "../controller/attendance.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const attendanceRouter = express.Router();
const attendanceController = new AttendanceController();

attendanceRouter.post("/:eventId/:participantId", authenticateUser, attendanceController.markAttendance);

export default attendanceRouter;