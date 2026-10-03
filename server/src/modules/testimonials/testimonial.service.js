import { Testimonial } from './testimonial.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { processAndSaveImage } from '../../utils/imageProcessor.js';

export class TestimonialService {
  static async createTestimonial(data) {
    if (data.avatar && data.avatar.startsWith('data:image')) {
      const base64Data = data.avatar.split(';base64,').pop();
      const buffer = Buffer.from(base64Data, 'base64');
      const imageSizes = await processAndSaveImage(buffer, 'testimonials');
      data.avatar = imageSizes.thumb;
    }
    return await Testimonial.create(data);
  }

  static async getAllTestimonials(query = {}) {
    const { isActive, sort = '-createdAt', limit = 10, page = 1 } = query;
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const testimonials = await Testimonial.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Testimonial.countDocuments(filter);

    return {
      testimonials,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  static async getTestimonialById(id) {
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      throw new ApiError(404, 'Testimonial not found');
    }
    return testimonial;
  }

  static async updateTestimonial(id, data) {
    if (data.avatar && data.avatar.startsWith('data:image')) {
      const base64Data = data.avatar.split(';base64,').pop();
      const buffer = Buffer.from(base64Data, 'base64');
      const imageSizes = await processAndSaveImage(buffer, 'testimonials');
      data.avatar = imageSizes.thumb;
    }
    const testimonial = await Testimonial.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) {
      throw new ApiError(404, 'Testimonial not found');
    }
    return testimonial;
  }

  static async deleteTestimonial(id) {
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      throw new ApiError(404, 'Testimonial not found');
    }
    return testimonial;
  }
}
