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
      sparse: true, // Sparse unique index because it might not be there initially or we might want uniqueness only if present
      unique: true,
      index: true,
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

paymentSchema.index({ providerPaymentId: 1 }, { unique: true, sparse: true });
paymentSchema.index({ status: 1 });

export const Payment = mongoose.model('Payment', paymentSchema);
