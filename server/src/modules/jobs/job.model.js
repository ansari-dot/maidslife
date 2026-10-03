import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    department: {
      type: String,
      default: 'Housekeeping & Operations',
      trim: true,
    },
    type: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Contract', 'Temporary'],
      default: 'Full-Time',
    },
    location: {
      type: String,
      default: 'Dubai, UAE',
      trim: true,
    },
    salary: {
      type: String,
      required: [true, 'Salary range is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export const Job = mongoose.model('Job', jobSchema);
