import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { CleanerService } from './cleaner.service.js';
import { ApiError } from '../../utils/ApiError.js';

export const createCleaner = asyncHandler(async (req, res) => {
  const cleaner = await CleanerService.createCleaner(req.body);
  return res.status(201).json(new ApiResponse(201, cleaner, 'Cleaner created successfully'));
});

export const getCleaners = asyncHandler(async (req, res) => {
  const { cleaners, meta } = await CleanerService.getAllCleaners(req.query);
  return res.status(200).json(new ApiResponse(200, cleaners, 'Cleaners retrieved successfully', meta));
});

export const getAvailableCleaners = asyncHandler(async (req, res) => {
  const cleaners = await CleanerService.getAvailableCleaners(req.query);
  return res.status(200).json(new ApiResponse(200, cleaners, 'Available cleaners retrieved successfully'));
});

export const getCleanerById = asyncHandler(async (req, res) => {
  const cleaner = await CleanerService.getCleanerById(req.params.id);
  return res.status(200).json(new ApiResponse(200, cleaner, 'Cleaner retrieved successfully'));
});

export const updateCleaner = asyncHandler(async (req, res) => {
  const cleaner = await CleanerService.updateCleaner(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, cleaner, 'Cleaner updated successfully'));
});

export const updateCleanerStatus = asyncHandler(async (req, res) => {
  const cleaner = await CleanerService.updateCleanerStatus(req.params.id, req.body.status);
  return res.status(200).json(new ApiResponse(200, cleaner, 'Cleaner status updated successfully'));
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Avatar image file is required');
  }
  const cleaner = await CleanerService.uploadAvatar(req.params.id, req.file.buffer);
  return res.status(200).json(new ApiResponse(200, cleaner, 'Cleaner avatar uploaded & optimized'));
});

export const deleteCleaner = asyncHandler(async (req, res) => {
  await CleanerService.deleteCleaner(req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Cleaner deleted successfully'));
});
