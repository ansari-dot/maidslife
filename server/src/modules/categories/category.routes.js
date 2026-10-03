import { Router } from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from './category.controller.js';
import { createCategorySchema, updateCategorySchema } from './category.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

router
  .route('/')
  .get(getCategories)
  .post(verifyJWT, authorizeRoles('super_admin', 'ops_manager'), validate(createCategorySchema), createCategory);

router
  .route('/:id')
  .get(getCategoryById)
  .put(verifyJWT, authorizeRoles('super_admin', 'ops_manager'), validate(updateCategorySchema), updateCategory)
  .delete(verifyJWT, authorizeRoles('super_admin'), deleteCategory);

export default router;
