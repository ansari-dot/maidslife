import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { VariantService } from './variant.service.js';

export const createVariant = asyncHandler(async (req, res) => {
  const variant = await VariantService.createVariant(req.body);
  return res.status(201).json(new ApiResponse(201, variant, 'Variant created successfully'));
});

export const getVariants = asyncHandler(async (req, res) => {
  const { variants, meta } = await VariantService.getAllVariants(req.query);
  return res.status(200).json(new ApiResponse(200, variants, 'Variants retrieved successfully', meta));
});

export const getVariantsByService = asyncHandler(async (req, res) => {
  const variants = await VariantService.getVariantsByService(req.params.serviceId);
  return res.status(200).json(new ApiResponse(200, variants, 'Service variants retrieved successfully'));
});

export const getVariantById = asyncHandler(async (req, res) => {
  const variant = await VariantService.getVariantById(req.params.id);
  return res.status(200).json(new ApiResponse(200, variant, 'Variant retrieved successfully'));
});

export const updateVariant = asyncHandler(async (req, res) => {
  const variant = await VariantService.updateVariant(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, variant, 'Variant updated successfully'));
});

export const deleteVariant = asyncHandler(async (req, res) => {
  await VariantService.deleteVariant(req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Variant deleted successfully'));
});
