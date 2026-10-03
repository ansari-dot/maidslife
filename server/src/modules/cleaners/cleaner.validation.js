import { z } from 'zod';

export const createCleanerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(8, 'Phone number is required'),
    email: z.string().email().optional(),
    avatarUrl: z.string().optional(),
    emirate: z.enum(['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'UAQ', 'Fujairah']).optional(),
    rating: z.number().optional(),
    status: z.enum(['available', 'on_job', 'off_duty', 'on_leave']).optional(),
  }),
});

export const updateCleanerSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Cleaner ID is required'),
  }),
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    avatarUrl: z.string().optional(),
    emirate: z.enum(['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'UAQ', 'Fujairah']).optional(),
    rating: z.number().optional(),
    status: z.enum(['available', 'on_job', 'off_duty', 'on_leave']).optional(),
  }),
});

export const updateCleanerStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Cleaner ID is required'),
  }),
  body: z.object({
    status: z.enum(['available', 'on_job', 'off_duty', 'on_leave']),
  }),
});
