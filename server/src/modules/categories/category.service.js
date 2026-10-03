import { Category } from './category.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { getPaginationOptions, getPaginationMeta } from '../../utils/pagination.js';

export class CategoryService {
  static async createCategory(data) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-0]/g, '-').replace(/-+/g, '-');
    const existing = await Category.findOne({ slug });
    if (existing) {
      throw new ApiError(400, `Category slug '${slug}' already exists`);
    }

    const category = await Category.create({
      ...data,
      slug,
    });
    return category;
  }

  static async getAllCategories(query) {
    const { page, limit, skip, sort } = getPaginationOptions(query);
    const filter = {};

    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true';
    }

    const [categories, total] = await Promise.all([
      Category.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Category.countDocuments(filter),
    ]);

    return {
      categories,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  static async getCategoryById(id) {
    const category = await Category.findById(id).lean();
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }

  static async updateCategory(id, updateData) {
    if (updateData.name && !updateData.slug) {
      updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-0]/g, '-').replace(/-+/g, '-');
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }

  static async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }
}
