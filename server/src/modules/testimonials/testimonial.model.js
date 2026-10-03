import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      default: 'Customer',
    },
    content: {
      type: String,
      required: [true, 'Testimonial content is required'],
      trim: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    avatar: {
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

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
