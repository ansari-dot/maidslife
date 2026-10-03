import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { Payment } from './payment.model.js';
import { Booking } from '../bookings/booking.model.js';
import { ZiinaService } from './ziina.service.js';
import { env } from '../../config/env.js';

/**
 * @desc    Create a payment intent
 * @route   POST /api/v1/payments/create
 * @access  Private
 */
export const createPayment = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    throw new ApiError(400, 'Booking ID is required');
  }

  // 1. Find the order/booking
  const booking = await Booking.findById(bookingId);
  
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // 2. Verify order ownership (Assume req.user is populated by auth middleware)
  if (req.user && booking.customer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to pay for this booking');
  }

  // 3. Verify order status
  if (booking.paymentStatus === 'paid') {
    throw new ApiError(409, 'Booking is already paid');
  }

  // 4. Calculate / verify amount. Use backend total, ignore frontend amount.
  const amount = booking.amount; // Final amount calculated during booking creation
  const currency = 'AED';

  if (amount <= 0) {
    throw new ApiError(400, 'Amount must be greater than zero');
  }

  // 5. Create Payment record in PENDING state
  const payment = await Payment.create({
    bookingId: booking._id,
    customerId: booking.customer,
    amount,
    currency,
    status: 'PENDING',
    environment: env.ZIINA_MODE || 'test',
  });

  // 6. Send request to Ziina
  const redirectBase = req.headers.origin || env.CLIENT_URL || 'http://localhost:5173/payment';
  
  let ziinaRes;
  try {
    ziinaRes = await ZiinaService.createPayment(amount, currency, booking._id, redirectBase);
  } catch (error) {
    payment.status = 'FAILED';
    payment.failureReason = error.message || 'Payment service error';
    await payment.save();
    throw new ApiError(502, 'Failed to connect to payment provider: ' + error.message);
  }

  if (!ziinaRes || !ziinaRes.checkoutUrl) {
    payment.status = 'FAILED';
    payment.failureReason = 'Failed to generate checkout URL';
    await payment.save();
    throw new ApiError(502, 'Failed to connect to payment provider');
  }

  // 7. Save provider ID
  payment.providerPaymentId = ziinaRes.paymentId;
  await payment.save();

  // 8. Return response
  return res.status(200).json(new ApiResponse(200, {
    paymentId: payment._id,
    checkoutUrl: ziinaRes.checkoutUrl
  }, 'Payment created successfully'));
});

/**
 * @desc    Get payment by ID
 * @route   GET /api/v1/payments/:paymentId
 * @access  Private
 */
export const getPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  // Verify ownership
  if (req.user && payment.customerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied');
  }

  return res.status(200).json(new ApiResponse(200, payment, 'Payment retrieved successfully'));
});

/**
 * @desc    Handle Ziina Webhook
 * @route   POST /api/v1/payments/ziina/webhook
 * @access  Public
 */
export const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-ziina-signature']; // Replace with actual Ziina header

  // 1. Verify webhook signature
  const isValid = ZiinaService.verifyWebhook(req.body, signature);
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  const eventData = req.body;
  const eventType = eventData.type || eventData.event;
  const data = eventData.data || eventData;
  const status = data.status || eventData.status;

  // Ziina documentation should dictate exact payload structures
  // Assuming 'COMPLETED' or 'PAID' implies success
  if (eventType === 'payment_intent.succeeded' || status === 'COMPLETED' || status === 'PAID') {
    const bookingId = data.metadata?.booking_id || data.custom_id;
    const providerPaymentId = data.id || data.intent_id;

    if (!bookingId) {
      return res.status(400).send('Missing booking ID in metadata');
    }

    // 2. Find Payment
    const payment = await Payment.findOne({
      providerPaymentId: providerPaymentId,
    });

    if (!payment) {
      return res.status(404).send('Payment record not found');
    }

    // 3. Idempotency: Prevent duplicate processing
    if (payment.status === 'PAID') {
      return res.status(200).send('Already processed');
    }

    // 4. Verify Amount and Currency
    // Note: data.amount is likely in fils (e.g. 15000 for AED 150)
    const amountInSmallestUnit = Math.round(payment.amount * 100);
    if (data.amount && data.amount !== amountInSmallestUnit) {
      console.warn(`Amount mismatch. Expected ${amountInSmallestUnit}, received ${data.amount}`);
      payment.status = 'FAILED';
      payment.failureReason = 'Amount mismatch';
      await payment.save();
      return res.status(400).send('Amount mismatch');
    }

    // 5. Update Payment
    payment.status = 'PAID';
    payment.paidAt = new Date();
    await payment.save();

    // 6. Update Order/Booking
    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.paymentStatus = 'paid';
      booking.status = 'assigned'; // Or whatever logical confirmed status
      
      booking.timeline.push({
        status: booking.status,
        timestamp: new Date(),
        note: `Payment completed successfully (Ziina Webhook)`,
      });
      await booking.save();
    }
  } else if (eventType === 'payment_intent.failed' || status === 'FAILED' || status === 'REJECTED') {
    const providerPaymentId = data.id || data.intent_id;
    
    if (providerPaymentId) {
      const payment = await Payment.findOne({ providerPaymentId });
      if (payment && payment.status !== 'PAID') {
        payment.status = 'FAILED';
        payment.failureReason = data.failure_reason || 'Payment failed';
        await payment.save();
      }
    }
  }

  // Always return 200 to acknowledge receipt and stop retries
  return res.status(200).send('OK');
});
