import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Variant name is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    originalPrice: {
      type: Number,
    },
    description: {
      type: String,
      default: '',
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

export const Variant = mongoose.model('Variant', variantSchema);
