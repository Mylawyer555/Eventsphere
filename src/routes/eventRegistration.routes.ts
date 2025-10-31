import express from 'express';
import { EventRegistrationController } from '../controller/eventRegistration.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const registrationController = new EventRegistrationController();

const registrationRouter = express.Router();

registrationRouter.post('/events/:eventId/register', authenticateUser, registrationController.register.bind(registrationController));
registrationRouter.get('/users/:userId/registrations', authenticateUser, registrationController.getRegistration.bind(registrationController));
registrationRouter.delete('/events/:eventId/cancel', authenticateUser, registrationController.cancelRegistration.bind(registrationController));


export default registrationRouter;