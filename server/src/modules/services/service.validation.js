import { z } from 'zod';

const bookingFieldSchema = z.object({
  key: z.string(),
  label: z.string().optional(),
  enabled: z.boolean().optional(),
  required: z.boolean().optional(),
  order: z.number().optional(),
  unit: z.string().optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
});

export const createServiceSchema = z.object({
  body: z.object({
    category: z.string().min(1, 'Category ID is required'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    slug: z.string().optional(),
    tagline: z.string().optional(),
    description: z.string().optional(),
    startingPrice: z.number().min(0, 'Price cannot be negative').optional().default(0),
    extraProfessionalPrice: z.number().min(0, 'Extra professional price cannot be negative').optional(),
    extraHourPrice: z.number().min(0, 'Extra hour price cannot be negative').optional(),
    icon: z.string().optional(),
    image: z.string().optional(),
    features: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    bookingType: z.enum(['CLEANING', 'LAUNDRY', 'LAUNDRY_ITEM', 'DELIVERY', 'CUSTOM']).optional(),
    bookingFields: z.array(bookingFieldSchema).optional(),
    variants: z.array(
      z.object({
        name: z.string().min(1, 'Variant name is required'),
        price: z.number().min(0).optional(),
        image: z.string().optional(),
        isActive: z.boolean().optional(),
        allowMultiple: z.boolean().optional(),
        unit: z.string().optional(),
      })
    ).optional(),
  }),
});

export const updateServiceSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Service ID is required'),
  }),
  body: z.object({
    category: z.string().optional(),
    name: z.string().optional(),
    slug: z.string().optional(),
    tagline: z.string().optional(),
    description: z.string().optional(),
    startingPrice: z.number().optional(),
    extraProfessionalPrice: z.number().optional(),
    extraHourPrice: z.number().optional(),
    icon: z.string().optional(),
    image: z.string().optional(),
    features: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    bookingType: z.enum(['CLEANING', 'LAUNDRY', 'LAUNDRY_ITEM', 'DELIVERY', 'CUSTOM']).optional(),
    bookingFields: z.array(bookingFieldSchema).optional(),
    variants: z.array(
      z.object({
        name: z.string().min(1, 'Variant name is required'),
        price: z.number().min(0).optional(),
        image: z.string().optional(),
        isActive: z.boolean().optional(),
        allowMultiple: z.boolean().optional(),
        unit: z.string().optional(),
      })
    ).optional(),
  }),
});
