import { GalleryItem } from './gallery.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { getPaginationOptions, getPaginationMeta } from '../../utils/pagination.js';
import { processAndSaveImage } from '../../utils/imageProcessor.js';

export class GalleryService {
  static async createGalleryItem(data) {
    let beforeImageDerivatives = null;
    let afterImageDerivatives = null;

    if (data.beforeImage && data.beforeImage.startsWith('data:image')) {
      const base64Data = data.beforeImage.split(';base64,').pop();
      beforeImageDerivatives = await processAndSaveImage(Buffer.from(base64Data, 'base64'), 'gallery');
    }
    if (data.afterImage && data.afterImage.startsWith('data:image')) {
      const base64Data = data.afterImage.split(';base64,').pop();
      afterImageDerivatives = await processAndSaveImage(Buffer.from(base64Data, 'base64'), 'gallery');
    }

    const galleryItem = await GalleryItem.create({
      ...data,
      beforeImage: beforeImageDerivatives || undefined,
      afterImage: afterImageDerivatives || undefined,
    });

    return galleryItem;
  }

  static async getAllGalleryItems(query) {
    const { page, limit, skip, sort } = getPaginationOptions(query);
    const filter = {};

    if (query.category) {
      filter.category = query.category;
    }
    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true';
    }

    const [items, total] = await Promise.all([
      GalleryItem.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      GalleryItem.countDocuments(filter),
    ]);

    return {
      items,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  static async getGalleryItemById(id) {
    const item = await GalleryItem.findById(id).lean();
    if (!item) {
      throw new ApiError(404, 'Gallery item not found');
    }
    return item;
  }

  static async updateGalleryItem(id, updateData) {
    const item = await GalleryItem.findById(id);
    if (!item) {
      throw new ApiError(404, 'Gallery item not found');
    }

    if (updateData.beforeImage && updateData.beforeImage.startsWith('data:image')) {
      const base64Data = updateData.beforeImage.split(';base64,').pop();
      updateData.beforeImage = await processAndSaveImage(Buffer.from(base64Data, 'base64'), 'gallery');
    }
    if (updateData.afterImage && updateData.afterImage.startsWith('data:image')) {
      const base64Data = updateData.afterImage.split(';base64,').pop();
      updateData.afterImage = await processAndSaveImage(Buffer.from(base64Data, 'base64'), 'gallery');
    }

    Object.assign(item, updateData);
    await item.save();

    return item;
  }

  static async deleteGalleryItem(id) {
    const item = await GalleryItem.findByIdAndDelete(id);
    if (!item) {
      throw new ApiError(404, 'Gallery item not found');
    }
    return item;
  }
}
