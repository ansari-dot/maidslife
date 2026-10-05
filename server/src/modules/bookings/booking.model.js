import mongoose from 'mongoose';

const timelineEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingRef: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer is required'],
      index: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service is required'],
    },

    addons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Addon',
      },
    ],
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      sparse: true,
    },
    variantName: {
      type: String,
      default: '',
    },
    variants: [
      {
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          sparse: true,
        },
        name: {
          type: String,
          default: '',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          default: 0,
        },
      },
    ],
    frequency: {
      type: String,
      default: '',
    },
    cleaner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cleaner',
      sparse: true,
      index: true,
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      index: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled date and time is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['pending_assignment', 'assigned', 'in_transit', 'in_progress', 'completed', 'cancelled'],
      default: 'pending_assignment',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    paymentMethod: {
      type: String,
      default: 'Card',
    },
    amount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: '',
    },
    timeline: [timelineEntrySchema],
    internalNotes: {
      type: String,
      default: '',
    },
    hours: {
      type: Number,
      default: 2,
    },
    professionalsCount: {
      type: Number,
      default: 1,
    },
    needCleaningMaterials: {
      type: Boolean,
      default: false,
    },
    specialInstructions: {
      type: String,
      default: '',
    },
    quantity: {
      type: Number,
      default: 1,
    },
    weight: {
      type: Number,
    },
    itemType: {
      type: String,
      default: '',
    },
    pickupLocation: {
      type: String,
      default: '',
    },
    dropoffLocation: {
      type: String,
      default: '',
    },
    vehicleType: {
      type: String,
      default: '',
    },
    driver: {
      type: String,
      default: '',
    },
    propertyType: {
      type: String,
      default: '',
    },
    bedrooms: {
      type: Number,
    },
    bathrooms: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ status: 1, scheduledAt: -1 });
bookingSchema.index({ area: 1, status: 1 });

export const Booking = mongoose.model('Booking', bookingSchema);
