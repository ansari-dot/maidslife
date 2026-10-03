import mongoose from 'mongoose';

const addonSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Addon name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    duration: {
      type: String,
      default: '30 mins',
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

export const Addon = mongoose.model('Addon', addonSchema);
