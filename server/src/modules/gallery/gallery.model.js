import mongoose from 'mongoose';

const imageDerivativesSchema = new mongoose.Schema(
  {
    thumb: String,
    medium: String,
    full: String,
  },
  { _id: false }
);

const galleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    beforeImage: imageDerivativesSchema,
    afterImage: imageDerivativesSchema,
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    cleanerName: { type: String },
    location: { type: String },
    customerReview: { type: String },
    isFeatured: { type: Boolean, default: false },
    serviceId: { type: String },
  },
  {
    timestamps: true,
  }
);

export const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
