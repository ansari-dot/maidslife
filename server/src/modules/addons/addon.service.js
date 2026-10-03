import { Addon } from './addon.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { getPaginationOptions, getPaginationMeta } from '../../utils/pagination.js';

export class AddonService {
  static async createAddon(data) {
    const addon = await Addon.create(data);
    return addon;
  }

  static async getAllAddons(query) {
    const { page, limit, skip, sort } = getPaginationOptions(query);
    const filter = {};

    if (query.service) {
      filter.service = query.service;
    }
    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true';
    }

    const [addons, total] = await Promise.all([
      Addon.find(filter).populate('service', 'name slug').sort(sort).skip(skip).limit(limit).lean(),
      Addon.countDocuments(filter),
    ]);

    return {
      addons,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  static async getAddonById(id) {
    const addon = await Addon.findById(id).populate('service', 'name slug').lean();
    if (!addon) {
      throw new ApiError(404, 'Addon not found');
    }
    return addon;
  }

  static async updateAddon(id, updateData) {
    const addon = await Addon.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('service', 'name slug');

    if (!addon) {
      throw new ApiError(404, 'Addon not found');
    }
    return addon;
  }

  static async deleteAddon(id) {
    const addon = await Addon.findByIdAndDelete(id);
    if (!addon) {
      throw new ApiError(404, 'Addon not found');
    }
    return addon;
  }
}
