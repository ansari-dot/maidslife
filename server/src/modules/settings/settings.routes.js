import { Router } from 'express';
import {
  getSettings,
  updateGeneralSettings,
  updateBusinessSettings,
  updateNotificationSettings,
  updateSecuritySettings,
  updateAnnouncementSettings,
} from './settings.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();



router.get('/', getSettings);
router.put('/general', verifyJWT, authorizeRoles('super_admin'), updateGeneralSettings);
router.put('/business', verifyJWT, authorizeRoles('super_admin', 'ops_manager'), updateBusinessSettings);
router.put('/notifications', verifyJWT, authorizeRoles('super_admin'), updateNotificationSettings);
router.put('/security', verifyJWT, authorizeRoles('super_admin'), updateSecuritySettings);
router.put('/announcement', verifyJWT, authorizeRoles('super_admin', 'ops_manager'), updateAnnouncementSettings);

export default router;
