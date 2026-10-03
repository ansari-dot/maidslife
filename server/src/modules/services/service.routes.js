import { Router } from 'express';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  uploadServiceImage,
} from './service.controller.js';
import { createServiceSchema, updateServiceSchema } from './service.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';
import { upload } from '../../config/multer.js';

const router = Router();

router
  .route('/')
  .get(getServices)
  .post(verifyJWT, authorizeRoles('super_admin', 'ops_manager'), validate(createServiceSchema), createService);

router
  .route('/:id')
  .get(getServiceById)
  .put(verifyJWT, authorizeRoles('super_admin', 'ops_manager'), validate(updateServiceSchema), updateService)
  .delete(verifyJWT, authorizeRoles('super_admin'), deleteService);

router
  .route('/:id/images')
  .post(verifyJWT, authorizeRoles('super_admin', 'ops_manager'), upload.single('image'), uploadServiceImage);

export default router;
