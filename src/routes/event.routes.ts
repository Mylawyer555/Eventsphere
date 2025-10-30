import express from 'express';
import { EventController } from '../controller/event.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import isAdmin from '../middleware/isAdmin.middleware';

const eventRouter = express.Router();
const eventController = new EventController();

// PUBLIC ROUTES
eventRouter.get('/', eventController.listEvents);

eventRouter.get('/:id', eventController.getEventById)

//ORGANIZER'S ROUTES
eventRouter.post('/', authenticateUser, eventController.createEvent);

eventRouter.put('/:id',authenticateUser, eventController.updateEvent);

eventRouter.patch('/:id/cancel', authenticateUser, eventController.cancelEvent);

eventRouter.delete('/:id', authenticateUser, eventController.deleteEvent);

eventRouter.patch('/:id/update-status', authenticateUser, eventController.updateEventStatus);

eventRouter.patch('/:id/update-venue', authenticateUser, eventController.updateEventVenue);


// ADMIN ROUTE
eventRouter.patch('/:id/review-event', authenticateUser, isAdmin, eventController.reviewEvent);

export default eventRouter;