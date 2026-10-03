import { Router } from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
} from './customer.controller.js';
import { createCustomerSchema, updateCustomerSchema } from './customer.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

router.use(verifyJWT);

router
  .route('/')
  .get(authorizeRoles('super_admin', 'ops_manager', 'support'), getCustomers)
  .post(authorizeRoles('super_admin', 'ops_manager'), validate(createCustomerSchema), createCustomer);

router
  .route('/:id')
  .get(authorizeRoles('super_admin', 'ops_manager', 'support'), getCustomerById)
  .put(authorizeRoles('super_admin', 'ops_manager'), validate(updateCustomerSchema), updateCustomer);

export default router;
