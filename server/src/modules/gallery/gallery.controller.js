import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { GalleryService } from './gallery.service.js';

export const createGalleryItem = asyncHandler(async (req, res) => {
  const item = await GalleryService.createGalleryItem(req.body);
  return res.status(201).json(new ApiResponse(201, item, 'Gallery item created successfully'));
});

export const getGalleryItems = asyncHandler(async (req, res) => {
  const { items, meta } = await GalleryService.getAllGalleryItems(req.query);
  return res.status(200).json(new ApiResponse(200, items, 'Gallery items retrieved successfully', meta));
});

export const getGalleryItemById = asyncHandler(async (req, res) => {
  const item = await GalleryService.getGalleryItemById(req.params.id);
  return res.status(200).json(new ApiResponse(200, item, 'Gallery item retrieved successfully'));
});

export const updateGalleryItem = asyncHandler(async (req, res) => {
  const item = await GalleryService.updateGalleryItem(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, item, 'Gallery item updated successfully'));
});

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  await GalleryService.deleteGalleryItem(req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Gallery item deleted successfully'));
});
