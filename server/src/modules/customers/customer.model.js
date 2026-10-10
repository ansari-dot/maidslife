import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    lastBookingAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.index({ email: 1 });
customerSchema.index({ phone: 1, status: 1 });
customerSchema.index({ createdAt: -1 });

export const Customer = mongoose.model('Customer', customerSchema);
