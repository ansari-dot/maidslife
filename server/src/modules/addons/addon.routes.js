import { Router } from 'express';
import {
  createAddon,
  getAddons,
  getAddonById,
  updateAddon,
  deleteAddon,
} from './addon.controller.js';
import { createAddonSchema, updateAddonSchema } from './addon.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

router
  .route('/')
  .get(getAddons)
  .post(verifyJWT, authorizeRoles('super_admin', 'ops_manager'), validate(createAddonSchema), createAddon);

router
  .route('/:id')
  .get(getAddonById)
  .put(verifyJWT, authorizeRoles('super_admin', 'ops_manager'), validate(updateAddonSchema), updateAddon)
  .delete(verifyJWT, authorizeRoles('super_admin'), deleteAddon);

export default router;
