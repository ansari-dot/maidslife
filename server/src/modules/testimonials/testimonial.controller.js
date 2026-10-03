import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { TestimonialService } from './testimonial.service.js';

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await TestimonialService.createTestimonial(req.body);
  return res.status(201).json(new ApiResponse(201, testimonial, 'Testimonial created successfully'));
});

export const getTestimonials = asyncHandler(async (req, res) => {
  const { testimonials, meta } = await TestimonialService.getAllTestimonials(req.query);
  return res.status(200).json(new ApiResponse(200, testimonials, 'Testimonials fetched successfully', meta));
});

export const getTestimonialById = asyncHandler(async (req, res) => {
  const testimonial = await TestimonialService.getTestimonialById(req.params.id);
  return res.status(200).json(new ApiResponse(200, testimonial, 'Testimonial retrieved successfully'));
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await TestimonialService.updateTestimonial(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, testimonial, 'Testimonial updated successfully'));
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  await TestimonialService.deleteTestimonial(req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Testimonial deleted successfully'));
});
