import { Router } from 'express';
import {
  createCleaner,
  getCleaners,
  getAvailableCleaners,
  getCleanerById,
  updateCleaner,
  updateCleanerStatus,
  uploadAvatar,
  deleteCleaner,
} from './cleaner.controller.js';
import {
  createCleanerSchema,
  updateCleanerSchema,
  updateCleanerStatusSchema,
} from './cleaner.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';
import { upload } from '../../config/multer.js';

const router = Router();

router
  .route('/')
  .get(getCleaners)
  .post(verifyJWT, authorizeRoles('super_admin', 'ops_manager'), validate(createCleanerSchema), createCleaner);

router.get('/availability', getAvailableCleaners);

router
  .route('/:id')
  .get(getCleanerById)
  .put(verifyJWT, authorizeRoles('super_admin', 'ops_manager'), validate(updateCleanerSchema), updateCleaner)
  .delete(verifyJWT, authorizeRoles('super_admin'), deleteCleaner);

router
  .route('/:id/status')
  .patch(verifyJWT, authorizeRoles('super_admin', 'ops_manager', 'dispatcher'), validate(updateCleanerStatusSchema), updateCleanerStatus);

router
  .route('/:id/avatar')
  .post(verifyJWT, authorizeRoles('super_admin', 'ops_manager'), upload.single('avatar'), uploadAvatar);

export default router;
