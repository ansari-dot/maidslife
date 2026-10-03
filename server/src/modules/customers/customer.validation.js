import { z } from 'zod';

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(8, 'Phone number is required'),
    email: z.string().email().optional(),
    status: z.enum(['active', 'blocked']).optional(),
  }),
});

export const updateCustomerSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Customer ID is required'),
  }),
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    status: z.enum(['active', 'blocked']).optional(),
  }),
});
