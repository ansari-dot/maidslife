import mongoose from 'mongoose';

const cleanerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cleaner name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    emirate: {
      type: String,
      enum: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'UAQ', 'Fujairah'],
      default: 'Dubai',
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    status: {
      type: String,
      enum: ['available', 'on_job', 'off_duty', 'on_leave'],
      default: 'available',
      index: true,
    },
    currentLocation: {
      lat: Number,
      lng: Number,
      areaName: String,
    },
    activeBookingsCount: {
      type: Number,
      default: 0,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Cleaner = mongoose.model('Cleaner', cleanerSchema);
