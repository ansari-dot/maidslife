import { Router } from 'express';
import {
  signup,
  verifyEmail,
  login,
  refresh,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from './auth.controller.js';
import {
  signupSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authLimiter } from '../../middlewares/rateLimiter.middleware.js';

const router = Router();

router.post('/signup', authLimiter, validate(signupSchema), signup);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', verifyJWT, logout);
router.get('/me', verifyJWT, getCurrentUser);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;
