import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    discountType: {
      type: String,
      enum: ['percent', 'flat'],
      required: [true, 'Discount type is required'],
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
    },
    maxDiscount: {
      type: Number,
      default: null,
    },
    minOrder: {
      type: Number,
      default: 0,
    },
    usageLimit: {
      type: Number,
      default: 100,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDisplayedOnCheckout: {
      type: Boolean,
      default: false,
    },
    usedByEmails: [
      {
        type: String,
        lowercase: true,
        trim: true,
      }
    ],
  },
  {
    timestamps: true,
  }
);

couponSchema.index({ code: 1, isActive: 1, expiresAt: 1 });
couponSchema.index({ isDisplayedOnCheckout: 1, isActive: 1 });

export const Coupon = mongoose.model('Coupon', couponSchema);
