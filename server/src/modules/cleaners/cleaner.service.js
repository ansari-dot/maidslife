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
