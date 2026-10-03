import express from 'express';
import {
  getActiveJobs,
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  submitApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
  downloadCv,
} from './job.controller.js';
import { uploadCv } from '../../middlewares/cvUpload.middleware.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = express.Router();

const ADMIN_ROLES = ['super_admin', 'ops_manager'];

// ── Public Routes ──
router.get('/', getActiveJobs);
router.post('/apply', uploadCv, submitApplication);

// ── Admin: Job Openings ──
router.get('/admin/all', verifyJWT, authorizeRoles(...ADMIN_ROLES), getAllJobs);
router.post('/admin', verifyJWT, authorizeRoles(...ADMIN_ROLES), createJob);
router.put('/admin/:id', verifyJWT, authorizeRoles(...ADMIN_ROLES), updateJob);
router.delete('/admin/:id', verifyJWT, authorizeRoles(...ADMIN_ROLES), deleteJob);

// ── Admin: Applications ──
router.get('/applications', verifyJWT, authorizeRoles(...ADMIN_ROLES), getApplications);
router.get('/applications/:id/cv', verifyJWT, authorizeRoles(...ADMIN_ROLES), downloadCv);
router.patch('/applications/:id', verifyJWT, authorizeRoles(...ADMIN_ROLES), updateApplicationStatus);
router.delete('/applications/:id', verifyJWT, authorizeRoles(...ADMIN_ROLES), deleteApplication);

export default router;
