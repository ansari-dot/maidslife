import { Router } from 'express';
import {
  getSettings,
  updateGeneralSettings,
  updateBusinessSettings,
  updateNotificationSettings,
  updateSecuritySettings,
} from './settings.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

router.use(verifyJWT);

router.get('/', getSettings);
router.put('/general', authorizeRoles('super_admin'), updateGeneralSettings);
router.put('/business', authorizeRoles('super_admin', 'ops_manager'), updateBusinessSettings);
router.put('/notifications', authorizeRoles('super_admin'), updateNotificationSettings);
router.put('/security', authorizeRoles('super_admin'), updateSecuritySettings);

export default router;
