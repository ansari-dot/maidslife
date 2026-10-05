import mongoose from 'mongoose';
import { Service } from './service.model.js';

import { Addon } from '../addons/addon.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { getPaginationOptions, getPaginationMeta } from '../../utils/pagination.js';
import { processAndSaveImage } from '../../utils/imageProcessor.js';

export function getDefaultBookingFields(bookingType = 'CLEANING') {
  switch (bookingType) {
    case 'LAUNDRY':
      return [
        { key: 'quantity', label: 'Quantity of Bags', enabled: true, required: true, order: 1, minValue: 1, maxValue: 10 },
        { key: 'date', label: 'Pickup Date', enabled: true, required: true, order: 2 },
        { key: 'time', label: 'Pickup Time', enabled: true, required: true, order: 3 },
        { key: 'address', label: 'Pickup & Delivery Address', enabled: true, required: true, order: 4 },
        { key: 'specialInstructions', label: 'Special Instructions', enabled: true, required: false, order: 5 },
      ];
    case 'LAUNDRY_ITEM':
      return [
        { key: 'itemType', label: 'Item Type', enabled: true, required: true, order: 1 },
        { key: 'quantity', label: 'Item Quantity', enabled: true, required: true, order: 2, minValue: 1, maxValue: 50 },
        { key: 'date', label: 'Pickup Date', enabled: true, required: true, order: 3 },
        { key: 'time', label: 'Pickup Time', enabled: true, required: true, order: 4 },
        { key: 'address', label: 'Address', enabled: true, required: true, order: 5 },
        { key: 'specialInstructions', label: 'Special Instructions', enabled: true, required: false, order: 6 },
      ];
    case 'DELIVERY':
      return [
        { key: 'pickupLocation', label: 'Pickup Location', enabled: true, required: true, order: 1 },
        { key: 'dropoffLocation', label: 'Drop-off Location', enabled: true, required: true, order: 2 },
        { key: 'vehicleType', label: 'Vehicle Type', enabled: true, required: true, order: 3 },
        { key: 'driver', label: 'Driver / Resource', enabled: true, required: false, order: 4 },
        { key: 'quantity', label: 'Item / Quantity', enabled: true, required: false, order: 5 },
        { key: 'date', label: 'Pickup Date', enabled: true, required: true, order: 6 },
        { key: 'time', label: 'Pickup Time', enabled: true, required: true, order: 7 },
        { key: 'specialInstructions', label: 'Special Instructions', enabled: true, required: false, order: 8 },
      ];
    case 'CLEANING':
    default:
      return [
        { key: 'duration', label: 'Duration (Hours)', enabled: true, required: true, order: 1, minValue: 1, maxValue: 8 },
        { key: 'professionals', label: 'Professionals', enabled: true, required: true, order: 2, minValue: 1, maxValue: 5 },
        { key: 'cleaningMaterials', label: 'Cleaning Materials', enabled: true, required: false, order: 3 },
        { key: 'date', label: 'Date', enabled: true, required: true, order: 4 },
        { key: 'time', label: 'Time Slot', enabled: true, required: true, order: 5 },
        { key: 'address', label: 'Address', enabled: true, required: true, order: 6 },
        { key: 'specialInstructions', label: 'Special Instructions', enabled: true, required: false, order: 7 },
      ];
  }
}

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
    if (!serviceData.bookingFields || serviceData.bookingFields.length === 0) {
      serviceData.bookingFields = getDefaultBookingFields(serviceData.bookingType);
    }

    if (imageToSave) {
      serviceData.images = [imageToSave];
    }

    if (serviceData.variants && Array.isArray(serviceData.variants)) {
      for (let i = 0; i < serviceData.variants.length; i++) {
        const variant = serviceData.variants[i];
        if (variant.image && variant.image.startsWith('data:image')) {
          const base64Data = variant.image.split(';base64,').pop();
          const buffer = Buffer.from(base64Data, 'base64');
          const imageSizes = await processAndSaveImage(buffer, 'services/variants');
          variant.image = imageSizes.full;
        }
      }
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
        const addons = await Addon.find({ service: service._id, isActive: true }).sort({ price: 1 }).lean();
        const bookingFields = (service.bookingFields && service.bookingFields.length > 0)
          ? service.bookingFields
          : getDefaultBookingFields(service.bookingType);
        return { ...service, addons, bookingFields };
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

    const addons = await Addon.find({ service: service._id, isActive: true }).sort({ price: 1 }).lean();
    const bookingFields = (service.bookingFields && service.bookingFields.length > 0)
      ? service.bookingFields
      : getDefaultBookingFields(service.bookingType);

    return {
      ...service,
      addons,
      bookingFields,
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

    if (updateData.variants && Array.isArray(updateData.variants)) {
      for (let i = 0; i < updateData.variants.length; i++) {
        const variant = updateData.variants[i];
        if (variant.image && variant.image.startsWith('data:image')) {
          const base64Data = variant.image.split(';base64,').pop();
          const buffer = Buffer.from(base64Data, 'base64');
          const imageSizes = await processAndSaveImage(buffer, 'services/variants');
          variant.image = imageSizes.full;
        }
      }
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
