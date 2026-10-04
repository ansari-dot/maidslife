import { Category } from './category.model.js';
import { Service } from '../services/service.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { getPaginationOptions, getPaginationMeta } from '../../utils/pagination.js';

export class CategoryService {
  static async createCategory(data) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const existing = await Category.findOne({ slug });
    if (existing) {
      throw new ApiError(400, `Category slug '${slug}' already exists`);
    }

    const category = await Category.create({
      ...data,
      slug,
      icon: data.icon || data.iconName || '',
      image: data.image || '',
    });
    return category;
  }

  static async getAllCategories(query = {}) {
    const { page, limit, skip, sort } = getPaginationOptions(query);
    const filter = {};

    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true';
    }

    const [rawCategories, total] = await Promise.all([
      Category.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Category.countDocuments(filter),
    ]);

    // Attach services count for each category
    const categoriesWithCount = await Promise.all(
      rawCategories.map(async (cat) => {
        const count = await Service.countDocuments({ category: cat._id });
        return {
          ...cat,
          id: cat._id.toString(),
          iconName: cat.icon || 'House',
          servicesCount: count,
        };
      })
    );

    return {
      categories: categoriesWithCount,
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
      updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    }
    if (updateData.iconName && !updateData.icon) {
      updateData.icon = updateData.iconName;
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    const catObj = category.toObject();
    const count = await Service.countDocuments({ category: category._id });
    return {
      ...catObj,
      id: catObj._id.toString(),
      iconName: catObj.icon || 'House',
      servicesCount: count,
    };
  }

  static async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }
}
