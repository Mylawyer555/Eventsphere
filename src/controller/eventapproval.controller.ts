import { NextFunction, Response } from "express";
import { CustomRequest } from "../middleware/auth.middleware";
import { CustomError } from "../exceptions/customError.error";
import { StatusCodes } from "http-status-codes";
import { EventApprovalServiceImple } from "../service/Imple/eventapproval.service.imple";

export class EventApprovalController {
  private eventApprovalService: EventApprovalServiceImple;

  constructor() {
    this.eventApprovalService = new EventApprovalServiceImple();
  }

  public reviewEvent = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const adminId = req.userAuth?.id;
      const { eventId } = req.params;
      const { decision, message } = req.body;

      if (!adminId) {
        throw new CustomError(StatusCodes.FORBIDDEN, "Unauthorized");
      }

      const eventsId = Number(eventId);
      if (isNaN(eventsId))
        throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid eventId");

      const result = await this.eventApprovalService.approveEvent(
        adminId,
        eventsId,
        decision,
        message
      );
      res.status(200).json({
        message: `Event ${decision.toLowerCase()} successfully.`,
        event: result,
      });
    } catch (error) {
        next(error)
    }
  };
  
};
