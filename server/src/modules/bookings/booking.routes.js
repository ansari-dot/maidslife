import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  assignCleaner,
  handleZiinaWebhook,
  deleteBooking,
} from './booking.controller.js';
import {
  createBookingSchema,
  updateBookingStatusSchema,
  assignCleanerSchema,
} from './booking.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

router
  .route('/')
  .get(getBookings)
  .post(validate(createBookingSchema), createBooking);

router.post('/webhook/ziina', handleZiinaWebhook);

router
  .route('/:id')
  .get(verifyJWT, authorizeRoles('super_admin', 'ops_manager', 'dispatcher', 'support'), getBookingById)
  .delete(verifyJWT, authorizeRoles('super_admin', 'ops_manager'), deleteBooking);

router
  .route('/:id/status')
  .patch(verifyJWT, authorizeRoles('super_admin', 'ops_manager', 'dispatcher', 'support'), validate(updateBookingStatusSchema), updateBookingStatus);

router
  .route('/:id/assign-cleaner')
  .patch(verifyJWT, authorizeRoles('super_admin', 'ops_manager', 'dispatcher'), validate(assignCleanerSchema), assignCleaner);

export default router;
