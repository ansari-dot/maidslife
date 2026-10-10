import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    provider: {
      type: String,
      default: 'ZIINA',
      required: true,
    },
    providerPaymentId: {
      type: String,
      sparse: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'AED',
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED', 'EXPIRED', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    environment: {
      type: String,
      enum: ['test', 'production'],
      default: 'test',
    },
    failureReason: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ customerId: 1, createdAt: -1 });

export const Payment = mongoose.model('Payment', paymentSchema);
