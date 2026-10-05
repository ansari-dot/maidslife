import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    customer: z.string().optional(),
    customerName: z.string().optional(),
    customerPhone: z.string().optional(),
    customerEmail: z.string().optional(),
    service: z.string().min(1, 'Service ID is required'),

    addons: z.array(z.string()).optional(),
    variantId: z.string().optional(),
    variantName: z.string().optional(),
    cleaner: z.string().optional(),
    area: z.string().optional(),
    address: z.string().optional(),
    coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
    scheduledAt: z.string().or(z.date()),
    amount: z.number().min(0, 'Amount must be non-negative'),
    discount: z.number().optional(),
    couponCode: z.string().optional(),
    paymentMethod: z.string().optional(),
    internalNotes: z.string().optional(),
    hours: z.number().optional(),
    professionalsCount: z.number().optional(),
    needCleaningMaterials: z.boolean().optional(),
    specialInstructions: z.string().optional(),
    quantity: z.number().optional(),
    weight: z.number().optional(),
    itemType: z.string().optional(),
    pickupLocation: z.string().optional(),
    dropoffLocation: z.string().optional(),
    vehicleType: z.string().optional(),
    driver: z.string().optional(),
    propertyType: z.string().optional(),
    bedrooms: z.number().optional(),
    bathrooms: z.number().optional(),
  }),
});

export const updateBookingStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Booking ID is required'),
  }),
  body: z.object({
    status: z.enum(['pending_assignment', 'assigned', 'in_transit', 'in_progress', 'completed', 'cancelled']),
    note: z.string().optional(),
  }),
});

export const assignCleanerSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Booking ID is required'),
  }),
  body: z.object({
    cleanerId: z.string().min(1, 'Cleaner ID is required'),
  }),
});
