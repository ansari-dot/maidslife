import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { AddonService } from './addon.service.js';

export const createAddon = asyncHandler(async (req, res) => {
  const addon = await AddonService.createAddon(req.body);
  return res.status(201).json(new ApiResponse(201, addon, 'Addon created successfully'));
});

export const getAddons = asyncHandler(async (req, res) => {
  const { addons, meta } = await AddonService.getAllAddons(req.query);
  return res.status(200).json(new ApiResponse(200, addons, 'Addons retrieved successfully', meta));
});

export const getAddonById = asyncHandler(async (req, res) => {
  const addon = await AddonService.getAddonById(req.params.id);
  return res.status(200).json(new ApiResponse(200, addon, 'Addon retrieved successfully'));
});

export const updateAddon = asyncHandler(async (req, res) => {
  const addon = await AddonService.updateAddon(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, addon, 'Addon updated successfully'));
});

export const deleteAddon = asyncHandler(async (req, res) => {
  await AddonService.deleteAddon(req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Addon deleted successfully'));
});
