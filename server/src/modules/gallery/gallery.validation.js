import { z } from 'zod';

export const createGalleryItemSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().optional(),
    sortOrder: z.number().optional(),
    isActive: z.boolean().optional(),
    beforeImage: z.any().optional(),
    afterImage: z.any().optional(),
    cleanerName: z.string().optional(),
    location: z.string().optional(),
    customerReview: z.string().optional(),
    isFeatured: z.boolean().optional(),
    serviceId: z.string().optional(),
  }),
});

export const updateGalleryItemSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Gallery Item ID is required'),
  }),
  body: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    sortOrder: z.number().optional(),
    isActive: z.boolean().optional(),
    beforeImage: z.any().optional(),
    afterImage: z.any().optional(),
    cleanerName: z.string().optional(),
    location: z.string().optional(),
    customerReview: z.string().optional(),
    isFeatured: z.boolean().optional(),
    serviceId: z.string().optional(),
  }),
});
