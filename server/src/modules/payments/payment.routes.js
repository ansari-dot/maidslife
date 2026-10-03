import { Router } from 'express';
import { createPayment, getPayment, handleWebhook } from './payment.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

// Webhook (No auth required, handled internally via signature verification)
router.post('/ziina/webhook', handleWebhook);

// Payment Creation (Allow public/guest checkout as per booking flow)
router.post('/create', createPayment);

// Protected routes (if needed in future)
// router.use(verifyJWT);
router.get('/:paymentId', getPayment);

export default router;
