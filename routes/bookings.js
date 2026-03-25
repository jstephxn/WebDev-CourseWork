
// routes/bookings.js
import { Router } from 'express';
import { bookCourse, bookSession, cancelBooking } from '../controllers/bookingController.js';

const router = Router();

//router.post('/course', bookCourse);
router.post('/courses/:id/book', bookCourse);
router.post('/session', bookSession);
router.delete('/:bookingId', cancelBooking);
router.post('/sessions/:id/book', bookSession);
router.post('/:bookingId/cancel', cancelBooking)

export default router;
