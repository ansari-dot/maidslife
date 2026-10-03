import { Customer } from './customer.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { getPaginationOptions, getPaginationMeta } from '../../utils/pagination.js';
import { processAndSaveImage } from '../../utils/imageProcessor.js';

export class CustomerService {
  static async createCustomer(data) {
    const existing = await Customer.findOne({ phone: data.phone });
    if (existing) {
      throw new ApiError(400, `Customer with phone '${data.phone}' already exists`);
    }

    if (data.avatarUrl && data.avatarUrl.startsWith('data:image')) {
      const base64Data = data.avatarUrl.split(';base64,').pop();
      const buffer = Buffer.from(base64Data, 'base64');
      const imageSizes = await processAndSaveImage(buffer, 'customers');
      data.avatarUrl = imageSizes.medium;
    }

    const customer = await Customer.create(data);
    return customer;
  }

  static async getAllCustomers(query) {
    const { page, limit, skip, sort } = getPaginationOptions(query);
    const filter = {};

    if (query.status) {
      filter.status = query.status;
    }
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { phone: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [customers, total] = await Promise.all([
      Customer.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Customer.countDocuments(filter),
    ]);

    return {
      customers,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  static async getCustomerById(id) {
    const customer = await Customer.findById(id).lean();
    if (!customer) {
      throw new ApiError(404, 'Customer not found');
    }
    return customer;
  }

  static async updateCustomer(id, updateData) {
    if (updateData.avatarUrl && updateData.avatarUrl.startsWith('data:image')) {
      const base64Data = updateData.avatarUrl.split(';base64,').pop();
      const buffer = Buffer.from(base64Data, 'base64');
      const imageSizes = await processAndSaveImage(buffer, 'customers');
      updateData.avatarUrl = imageSizes.medium;
    }

    const customer = await Customer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      throw new ApiError(404, 'Customer not found');
    }
    return customer;
  }
}
