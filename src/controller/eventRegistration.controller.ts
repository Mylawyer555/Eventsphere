import { NextFunction, Response, Request } from "express";
import { EventRegistrationServiceImple } from "../service/Imple/eventRegistration.service.imple";
import { CustomRequest } from "../middleware/auth.middleware";
import { CustomError } from "../exceptions/customError.error";
import { StatusCodes } from "http-status-codes";

export class EventRegistrationController {
  private eventRegistrationService: EventRegistrationServiceImple;

  constructor() {
    this.eventRegistrationService = new EventRegistrationServiceImple();
  }

  public register = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { eventId } = req.params;
      const userId = req.userAuth?.id;

      if (!userId) {
        throw new CustomError(StatusCodes.FORBIDDEN, "Unauthorized");
      }

      const eventIdCheck = Number(eventId);
      if (isNaN(eventIdCheck)) {
        throw new CustomError(StatusCodes.BAD_REQUEST, "eventId invalid");
      }

      await this.eventRegistrationService.registerEvent(userId, eventIdCheck);
      res.status(201).json({
        error: false,
        message: "Registration successful",
      });
    } catch (error: any) {
      next(error);
    }
  };
  public getRegistration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;

      const user = Number(userId);
      if (isNaN(user))
        throw new CustomError(StatusCodes.BAD_REQUEST, "invalid user id");

      const events =
        await this.eventRegistrationService.getEventRegistered(user);
      res.status(200).json(events);
    } catch (error: any) {
      next(error);
    }
  };
  public cancelRegistration = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { eventId } = req.params;
      const userId = req.userAuth?.id;

      if (!userId) throw new CustomError(StatusCodes.FORBIDDEN, "Unauthorized");

      const eventIdCheck = Number(eventId);
      if (isNaN(eventIdCheck)) {
        throw new CustomError(StatusCodes.BAD_REQUEST, "eventId invalid");
      }

      const events = await this.eventRegistrationService.cancelUserRegistration(
        userId,
        eventIdCheck
      );
      res.status(200).json({ message: "Registration cancelled successfully" });
    } catch (error: any) {
      next(error);
    }
  };
}
