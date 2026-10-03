import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ServiceService } from './service.service.js';
import { ApiError } from '../../utils/ApiError.js';

export const createService = asyncHandler(async (req, res) => {
  const service = await ServiceService.createService(req.body);
  return res.status(201).json(new ApiResponse(201, service, 'Service created successfully'));
});

export const getServices = asyncHandler(async (req, res) => {
  const { services, meta } = await ServiceService.getAllServices(req.query);
  return res.status(200).json(new ApiResponse(200, services, 'Services retrieved successfully', meta));
});

export const getServiceById = asyncHandler(async (req, res) => {
  const service = await ServiceService.getServiceById(req.params.id);
  return res.status(200).json(new ApiResponse(200, service, 'Service retrieved successfully'));
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await ServiceService.updateService(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, service, 'Service updated successfully'));
});

export const deleteService = asyncHandler(async (req, res) => {
  await ServiceService.deleteService(req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Service deleted successfully'));
});

export const uploadServiceImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Image file is required');
  }
  const service = await ServiceService.uploadServiceImage(req.params.id, req.file.buffer);
  return res.status(200).json(new ApiResponse(200, service, 'Service image uploaded & optimized successfully'));
});
