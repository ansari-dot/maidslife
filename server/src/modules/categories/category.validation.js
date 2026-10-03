import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    slug: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    sortOrder: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Category ID is required'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    sortOrder: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});
