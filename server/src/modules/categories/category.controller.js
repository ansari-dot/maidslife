import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { CategoryService } from './category.service.js';

export const createCategory = asyncHandler(async (req, res) => {
  const category = await CategoryService.createCategory(req.body);
  return res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
});

export const getCategories = asyncHandler(async (req, res) => {
  const { categories, meta } = await CategoryService.getAllCategories(req.query);
  return res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully', meta));
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await CategoryService.getCategoryById(req.params.id);
  return res.status(200).json(new ApiResponse(200, category, 'Category retrieved successfully'));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await CategoryService.updateCategory(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, category, 'Category updated successfully'));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await CategoryService.deleteCategory(req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Category deleted successfully'));
});
