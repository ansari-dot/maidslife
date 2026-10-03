import { Router } from 'express';
import {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getCheckoutCoupon,
} from './coupon.controller.js';
import {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
} from './coupon.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

router.post('/validate', validate(validateCouponSchema), validateCoupon);
router.get('/checkout-display', getCheckoutCoupon);

router.use(verifyJWT);

router
  .route('/')
  .get(authorizeRoles('super_admin', 'ops_manager', 'support'), getCoupons)
  .post(authorizeRoles('super_admin', 'ops_manager'), validate(createCouponSchema), createCoupon);

router
  .route('/:id')
  .get(authorizeRoles('super_admin', 'ops_manager', 'support'), getCouponById)
  .put(authorizeRoles('super_admin', 'ops_manager'), validate(updateCouponSchema), updateCoupon)
  .delete(authorizeRoles('super_admin'), deleteCoupon);

export default router;
