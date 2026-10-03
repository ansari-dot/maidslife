import { Router } from 'express';
import {
  getOverviewReport,
  getRevenueReport,
  getByServiceReport,
  getByAreaReport,
  getCleanerPerformanceReport,
} from './reports.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

router.use(verifyJWT, authorizeRoles('super_admin', 'ops_manager'));

router.get('/overview', getOverviewReport);
router.get('/revenue', getRevenueReport);
router.get('/by-service', getByServiceReport);
router.get('/by-area', getByAreaReport);
router.get('/cleaner-performance', getCleanerPerformanceReport);

export default router;
