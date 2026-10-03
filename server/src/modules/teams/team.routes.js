import { Router } from 'express';
import {
  createTeamMember,
  getTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} from './team.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// Public route to fetch team (for client site)
router.get('/', getTeamMembers);
router.get('/:id', getTeamMemberById);

// Protected routes (Admin only)
router.use(verifyJWT);
router.use(authorizeRoles('super_admin', 'ops_manager', 'dispatcher'));

router.post('/', createTeamMember);
router.put('/:id', updateTeamMember);
router.delete('/:id', deleteTeamMember);

export default router;
