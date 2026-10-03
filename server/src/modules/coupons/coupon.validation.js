import { z } from 'zod';

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(2, 'Code is required'),
    discountType: z.enum(['percent', 'flat']),
    discountValue: z.number().min(0, 'Discount value must be positive'),
    maxDiscount: z.number().optional().nullable(),
    minOrder: z.number().optional(),
    usageLimit: z.number().optional(),
    expiresAt: z.string().or(z.date()),
    isActive: z.boolean().optional(),
    isDisplayedOnCheckout: z.boolean().optional(),
  }),
});

export const updateCouponSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Coupon ID is required'),
  }),
  body: z.object({
    code: z.string().optional(),
    discountType: z.enum(['percent', 'flat']).optional(),
    discountValue: z.number().optional(),
    maxDiscount: z.number().optional().nullable(),
    minOrder: z.number().optional(),
    usageLimit: z.number().optional(),
    expiresAt: z.string().or(z.date()).optional(),
    isActive: z.boolean().optional(),
    isDisplayedOnCheckout: z.boolean().optional(),
  }),
});

export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Coupon code is required'),
    orderAmount: z.number().min(0, 'Order amount is required'),
    email: z.string().optional(),
  }),
});
