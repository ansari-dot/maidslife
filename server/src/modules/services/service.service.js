import mongoose from 'mongoose';
import { Service } from './service.model.js';
import { Variant } from '../variants/variant.model.js';
import { Addon } from '../addons/addon.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { getPaginationOptions, getPaginationMeta } from '../../utils/pagination.js';
import { processAndSaveImage } from '../../utils/imageProcessor.js';

export class ServiceService {
  static async createService(data) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const existing = await Service.findOne({ slug });
    if (existing) {
      throw new ApiError(400, `Service slug '${slug}' already exists`);
    }

    let imageToSave = null;
    if (data.image) {
      if (data.image.startsWith('data:image')) {
        const base64Data = data.image.split(';base64,').pop();
        const buffer = Buffer.from(base64Data, 'base64');
        const imageSizes = await processAndSaveImage(buffer, 'services');
        imageToSave = { url: imageSizes.full, sizes: imageSizes };
      } else {
        imageToSave = { url: data.image, sizes: {} };
      }
    }

    const serviceData = { ...data, slug };
    if (imageToSave) {
      serviceData.images = [imageToSave];
    }

    const service = await Service.create(serviceData);
    return service;
  }

  static async getAllServices(query) {
    const { page, limit, skip, sort } = getPaginationOptions(query);
    const filter = {};

    if (query.category) {
      filter.category = query.category;
    }
    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true';
    }

    const [services, total] = await Promise.all([
      Service.find(filter)
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Service.countDocuments(filter),
    ]);

    const servicesWithDetails = await Promise.all(
      services.map(async (service) => {
        const variants = await Variant.find({ service: service._id, isActive: true }).sort({ price: 1 }).lean();
        const addons = await Addon.find({ service: service._id, isActive: true }).sort({ price: 1 }).lean();
        return { ...service, variants, addons };
      })
    );

    return {
      services: servicesWithDetails,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  static async getServiceById(idOrSlug) {
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    const filter = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
    
    const service = await Service.findOne(filter).populate('category', 'name slug').lean();
    if (!service) {
      throw new ApiError(404, 'Service not found');
    }

    const [variants, addons] = await Promise.all([
      Variant.find({ service: service._id, isActive: true }).sort({ price: 1 }).lean(),
      Addon.find({ service: service._id, isActive: true }).sort({ price: 1 }).lean(),
    ]);

    return {
      ...service,
      variants,
      addons,
    };
  }

  static async updateService(id, updateData) {
    if (updateData.name && !updateData.slug) {
      updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    }

    if (updateData.image) {
      if (updateData.image.startsWith('data:image')) {
        const base64Data = updateData.image.split(';base64,').pop();
        const buffer = Buffer.from(base64Data, 'base64');
        const imageSizes = await processAndSaveImage(buffer, 'services');
        updateData.images = [{ url: imageSizes.full, sizes: imageSizes }];
      } else {
        updateData.images = [{ url: updateData.image, sizes: {} }];
      }
      delete updateData.image;
    }

    const service = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    if (!service) {
      throw new ApiError(404, 'Service not found');
    }
    return service;
  }

  static async deleteService(id) {
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      throw new ApiError(404, 'Service not found');
    }
    return service;
  }

  static async uploadServiceImage(serviceId, fileBuffer) {
    const service = await Service.findById(serviceId);
    if (!service) {
      throw new ApiError(404, 'Service not found');
    }

    const imageSizes = await processAndSaveImage(fileBuffer, 'services');

    const newImage = {
      url: imageSizes.full,
      sizes: imageSizes,
    };

    service.images.push(newImage);
    await service.save();

    return service;
  }
}
