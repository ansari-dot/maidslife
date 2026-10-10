import mongoose from 'mongoose';

const imageSizeSchema = new mongoose.Schema(
  {
    thumb: String,
    medium: String,
    full: String,
  },
  { _id: false }
);

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  allowMultiple: {
    type: Boolean,
    default: false,
  },
  unit: {
    type: String,
    default: '',
  },
});

const serviceSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Service slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    startingPrice: {
      type: Number,
      default: 0,
    },
    extraProfessionalPrice: {
      type: Number,
      default: 0,
    },
    extraHourPrice: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: String,
        sizes: imageSizeSchema,
      },
    ],
    icon: {
      type: String,
      default: '',
    },
    features: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 5.0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bookingType: {
      type: String,
      enum: ['CLEANING', 'LAUNDRY', 'LAUNDRY_ITEM', 'DELIVERY', 'CUSTOM'],
      default: 'CLEANING',
    },
    bookingFields: [
      {
        key: { type: String, required: true },
        label: { type: String, default: '' },
        enabled: { type: Boolean, default: true },
        required: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
        unit: { type: String, default: '' },
        minValue: { type: Number },
        maxValue: { type: Number },
      },
    ],
    variants: [variantSchema],
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ category: 1, isActive: 1 });

export const Service = mongoose.model('Service', serviceSchema);
