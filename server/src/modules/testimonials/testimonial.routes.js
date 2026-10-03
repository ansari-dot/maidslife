import { Router } from 'express';
import {
  createTestimonial,
  getTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from './testimonial.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// Public route to fetch testimonials (for client site)
router.get('/', getTestimonials);
router.get('/:id', getTestimonialById);

// Protected routes (Admin only)
router.use(verifyJWT);
router.use(authorizeRoles('super_admin', 'ops_manager', 'dispatcher'));

router.post('/', createTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
