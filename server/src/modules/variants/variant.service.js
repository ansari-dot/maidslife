import { Variant } from './variant.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { getPaginationOptions, getPaginationMeta } from '../../utils/pagination.js';

export class VariantService {
  static async createVariant(data) {
    const variant = await Variant.create(data);
    return variant;
  }

  static async getAllVariants(query) {
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

    const [variants, total] = await Promise.all([
      Variant.find(filter).populate('service', 'name slug').sort(sort).skip(skip).limit(limit).lean(),
      Variant.countDocuments(filter),
    ]);

    return {
      variants,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  static async getVariantsByService(serviceId) {
    return Variant.find({ service: serviceId, isActive: true }).lean();
  }

  static async getVariantById(id) {
    const variant = await Variant.findById(id).populate('service', 'name slug').lean();
    if (!variant) {
      throw new ApiError(404, 'Variant not found');
    }
    return variant;
  }

  static async updateVariant(id, updateData) {
    const variant = await Variant.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('service', 'name slug');

    if (!variant) {
      throw new ApiError(404, 'Variant not found');
    }
    return variant;
  }

  static async deleteVariant(id) {
    const variant = await Variant.findByIdAndDelete(id);
    if (!variant) {
      throw new ApiError(404, 'Variant not found');
    }
    return variant;
  }
}
