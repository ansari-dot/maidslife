import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'global_settings',
    },
    general: {
      appName: { type: String, default: 'Maidslife Home Services' },
      supportEmail: { type: String, default: 'support@maidslife.ae' },
      supportPhone: { type: String, default: '+971 4 000 0000' },
      currency: { type: String, default: 'AED' },
      timeZone: { type: String, default: 'Asia/Dubai' },
    },
    business: {
      taxRatePercent: { type: Number, default: 5 }, // 5% UAE VAT
      minBookingLeadTimeHours: { type: Number, default: 2 },
      maxBookingAdvanceDays: { type: Number, default: 30 },
      operatingHours: {
        start: { type: String, default: '08:00' },
        end: { type: String, default: '20:00' },
      },
    },
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: true },
      adminBookingAlerts: { type: Boolean, default: true },
    },
    security: {
      maxLoginAttempts: { type: Number, default: 5 },
      passwordMinLength: { type: Number, default: 6 },
      sessionTimeoutMinutes: { type: Number, default: 15 },
    },
  },
  {
    timestamps: true,
  }
);

export const Settings = mongoose.model('Settings', settingsSchema);
