import { z } from 'zod';

export const createVariantSchema = z.object({
  body: z.object({
    service: z.string().min(1, 'Service ID is required'),
    name: z.string().min(1, 'Name is required'),
    duration: z.string().min(1, 'Duration is required'),
    price: z.number().min(0, 'Price must be positive'),
    originalPrice: z.number().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateVariantSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Variant ID is required'),
  }),
  body: z.object({
    service: z.string().optional(),
    name: z.string().optional(),
    duration: z.string().optional(),
    price: z.number().optional(),
    originalPrice: z.number().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});
