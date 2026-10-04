import mongoose from 'mongoose';
import { Cleaner } from './cleaner.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { getPaginationOptions, getPaginationMeta } from '../../utils/pagination.js';
import { processAndSaveImage } from '../../utils/imageProcessor.js';

export class CleanerService {
  static async createCleaner(data) {
    const existing = await Cleaner.findOne({ phone: data.phone });
    if (existing) {
      throw new ApiError(400, `Cleaner with phone '${data.phone}' already exists`);
    }

    if (data.avatarUrl && data.avatarUrl.startsWith('data:image')) {
      const base64Data = data.avatarUrl.split(';base64,').pop();
      const buffer = Buffer.from(base64Data, 'base64');
      const imageSizes = await processAndSaveImage(buffer, 'cleaners');
      data.avatarUrl = imageSizes.medium;
    }

    const cleaner = await Cleaner.create(data);
    return cleaner;
  }

  static async getAllCleaners(query) {
    const { page, limit, skip, sort } = getPaginationOptions(query);
    const filter = {};

    if (query.status) {
      filter.status = query.status;
    }
    if (query.emirate) {
      filter.emirate = query.emirate;
    }
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { phone: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [cleaners, total] = await Promise.all([
      Cleaner.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Cleaner.countDocuments(filter),
    ]);

    return {
      cleaners,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  static async getAvailableCleaners(query) {
    const { date, lat, lng, radius = 50000, timeSlot } = query;
    const filter = { status: { $in: ['available', 'on_job'] } }; // they might be on_job but available for another time slot

    if (lat && lng) {
      filter.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    let cleaners = await Cleaner.find(filter).lean();

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const Booking = mongoose.model('Booking');
      const bookings = await Booking.find({
        scheduledAt: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ['assigned', 'in_transit', 'in_progress'] },
        cleaner: { $in: cleaners.map(c => c._id) }
      }).lean();

      if (timeSlot) {
        // filter out cleaners that are booked in this time slot
        // we assume a simple overlap check using timeSlot string or just exact match
        const bookedCleanerIds = bookings.filter(b => b.timeSlot === timeSlot).map(b => b.cleaner.toString());
        cleaners = cleaners.filter(c => !bookedCleanerIds.includes(c._id.toString()));
      } else {
        // map busy slots to cleaners
        cleaners = cleaners.map(c => {
          const cleanerBookings = bookings.filter(b => b.cleaner.toString() === c._id.toString());
          return {
            ...c,
            busySlots: cleanerBookings.map(b => b.timeSlot)
          };
        });
      }
    }

    return cleaners;
  }

  static async getCleanerById(id) {
    const cleaner = await Cleaner.findById(id).lean();
    if (!cleaner) {
      throw new ApiError(404, 'Cleaner not found');
    }
    return cleaner;
  }

  static async updateCleaner(id, updateData) {
    if (updateData.avatarUrl && updateData.avatarUrl.startsWith('data:image')) {
      const base64Data = updateData.avatarUrl.split(';base64,').pop();
      const buffer = Buffer.from(base64Data, 'base64');
      const imageSizes = await processAndSaveImage(buffer, 'cleaners');
      updateData.avatarUrl = imageSizes.medium;
    }

    const cleaner = await Cleaner.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!cleaner) {
      throw new ApiError(404, 'Cleaner not found');
    }
    return cleaner;
  }

  static async updateCleanerStatus(id, status) {
    const cleaner = await Cleaner.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!cleaner) {
      throw new ApiError(404, 'Cleaner not found');
    }
    return cleaner;
  }

  static async uploadAvatar(cleanerId, fileBuffer) {
    const cleaner = await Cleaner.findById(cleanerId);
    if (!cleaner) {
      throw new ApiError(404, 'Cleaner not found');
    }

    const imageSizes = await processAndSaveImage(fileBuffer, 'cleaners');
    cleaner.avatarUrl = imageSizes.medium;
    await cleaner.save();

    return cleaner;
  }

  static async deleteCleaner(id) {
    const cleaner = await Cleaner.findByIdAndDelete(id);
    if (!cleaner) {
      throw new ApiError(404, 'Cleaner not found');
    }
    return cleaner;
  }
}
