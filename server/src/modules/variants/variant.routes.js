import { Router } from 'express';
import {
  createVariant,
  getVariants,
  getVariantsByService,
  getVariantById,
  updateVariant,
  deleteVariant,
} from './variant.controller.js';
import { createVariantSchema, updateVariantSchema } from './variant.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

router
  .route('/')
  .get(getVariants)
  .post(verifyJWT, authorizeRoles('super_admin', 'ops_manager'), validate(createVariantSchema), createVariant);

router.get('/service/:serviceId', getVariantsByService);

router
  .route('/:id')
  .get(getVariantById)
  .put(verifyJWT, authorizeRoles('super_admin', 'ops_manager'), validate(updateVariantSchema), updateVariant)
  .delete(verifyJWT, authorizeRoles('super_admin'), deleteVariant);

export default router;
