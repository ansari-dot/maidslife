import { Coupon } from './coupon.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { getPaginationOptions, getPaginationMeta } from '../../utils/pagination.js';

export class CouponService {
  static async createCoupon(data) {
    const uppercaseCode = data.code.toUpperCase();
    const existing = await Coupon.findOne({ code: uppercaseCode });
    if (existing) {
      throw new ApiError(400, `Coupon code '${uppercaseCode}' already exists`);
    }

    const coupon = await Coupon.create({
      ...data,
      code: uppercaseCode,
    });
    return coupon;
  }

  static async getAllCoupons(query) {
    const { page, limit, skip, sort } = getPaginationOptions(query);
    const filter = {};

    if (query.search) {
      filter.code = { $regex: query.search, $options: 'i' };
    }
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true';
    }

    const [coupons, total] = await Promise.all([
      Coupon.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Coupon.countDocuments(filter),
    ]);

    return {
      coupons,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  static async getCheckoutCoupon() {
    const coupon = await Coupon.findOne({ 
      isDisplayedOnCheckout: true, 
      isActive: true
    }).lean();
    return coupon;
  }

  static async getCouponById(id) {
    const coupon = await Coupon.findById(id).lean();
    if (!coupon) {
      throw new ApiError(404, 'Coupon not found');
    }
    return coupon;
  }

  static async updateCoupon(id, updateData) {
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }
    const coupon = await Coupon.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!coupon) {
      throw new ApiError(404, 'Coupon not found');
    }
    return coupon;
  }

  static async deleteCoupon(id) {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      throw new ApiError(404, 'Coupon not found');
    }
    return coupon;
  }

  static async validateCoupon(code, orderAmount, email = '') {
    const uppercaseCode = code.toUpperCase();
    const coupon = await Coupon.findOne({ code: uppercaseCode, isActive: true });

    if (!coupon) {
      throw new ApiError(404, 'Invalid or inactive promo code');
    }

    if (new Date(coupon.expiresAt) < new Date()) {
      throw new ApiError(400, 'This promo code has expired');
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      throw new ApiError(400, 'This promo code usage limit has been reached');
    }

    if (orderAmount < coupon.minOrder) {
      throw new ApiError(400, `Minimum order amount of AED ${coupon.minOrder} required for this coupon`);
    }

    if (email && coupon.usedByEmails && coupon.usedByEmails.includes(email.toLowerCase())) {
      throw new ApiError(400, 'You have already used this promo code.');
    }

    let discountAmount = 0;
    if (coupon.discountType === 'flat') {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === 'percent') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    }

    return {
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: Math.round(discountAmount),
      finalPrice: Math.max(0, Math.round(orderAmount - discountAmount)),
    };
  }
}
