import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team member name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    experience: {
      type: String,
      default: '1+ Years Experience',
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

export const Team = mongoose.model('Team', teamSchema);
