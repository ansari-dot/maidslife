import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: false,
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    applicantName: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    experience: {
      type: String,
      default: '1-3 Years',
    },
    cvFile: {
      type: String,
      required: [true, 'CV (PDF) is required'],
    },
    cvOriginalName: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'interviewed', 'hired', 'rejected'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

jobApplicationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
