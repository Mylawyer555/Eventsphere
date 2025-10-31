import express from 'express';
import { EventApprovalController } from '../controller/eventapproval.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import isAdmin from '../middleware/isAdmin.middleware';

const approvalRouter = express.Router();
const approvalController = new EventApprovalController();


approvalRouter.post("/events/:eventId/review", authenticateUser, isAdmin, approvalController.reviewEvent.bind(approvalController));

export default approvalRouter;