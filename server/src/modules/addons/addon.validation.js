import { z } from 'zod';

export const createAddonSchema = z.object({
  body: z.object({
    service: z.string().min(1, 'Service ID is required'),
    name: z.string().min(1, 'Name is required'),
    price: z.number().min(0, 'Price must be positive'),
    duration: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateAddonSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Addon ID is required'),
  }),
  body: z.object({
    service: z.string().optional(),
    name: z.string().optional(),
    price: z.number().optional(),
    duration: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});
