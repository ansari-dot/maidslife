import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { CouponService } from './coupon.service.js';

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await CouponService.createCoupon(req.body);
  return res.status(201).json(new ApiResponse(201, coupon, 'Coupon created successfully'));
});

export const getCoupons = asyncHandler(async (req, res) => {
  const { coupons, meta } = await CouponService.getAllCoupons(req.query);
  return res.status(200).json(new ApiResponse(200, coupons, 'Coupons retrieved successfully', meta));
});

export const getCheckoutCoupon = asyncHandler(async (req, res) => {
  // Try to find a coupon flagged for checkout display
  const coupon = await CouponService.getCheckoutCoupon();
  return res.status(200).json(new ApiResponse(200, coupon || null, 'Checkout coupon retrieved'));
});

export const getCouponById = asyncHandler(async (req, res) => {
  const coupon = await CouponService.getCouponById(req.params.id);
  return res.status(200).json(new ApiResponse(200, coupon, 'Coupon retrieved successfully'));
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await CouponService.updateCoupon(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, coupon, 'Coupon updated successfully'));
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  await CouponService.deleteCoupon(req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Coupon deleted successfully'));
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const result = await CouponService.validateCoupon(req.body.code, req.body.orderAmount, req.body.email);
  return res.status(200).json(new ApiResponse(200, result, 'Coupon code validated'));
});
