import mongoose from 'mongoose';

const imageSizeSchema = new mongoose.Schema(
  {
    thumb: String,
    medium: String,
    full: String,
  },
  { _id: false }
);

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
      required: [true, 'Starting price is required'],
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
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ category: 1, isActive: 1 });

export const Service = mongoose.model('Service', serviceSchema);
