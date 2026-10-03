import { Team } from './team.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { processAndSaveImage } from '../../utils/imageProcessor.js';

export class TeamService {
  static async createTeamMember(data) {
    if (data.image && data.image.startsWith('data:image')) {
      const base64Data = data.image.split(';base64,').pop();
      const buffer = Buffer.from(base64Data, 'base64');
      const imageSizes = await processAndSaveImage(buffer, 'teams');
      data.image = imageSizes.medium;
    }
    return await Team.create(data);
  }

  static async getAllTeamMembers(query = {}) {
    const { isActive, sort = 'sortOrder -createdAt', limit = 20, page = 1 } = query;
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const team = await Team.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Team.countDocuments(filter);

    return {
      team,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  static async getTeamMemberById(id) {
    const member = await Team.findById(id);
    if (!member) {
      throw new ApiError(404, 'Team member not found');
    }
    return member;
  }

  static async updateTeamMember(id, data) {
    if (data.image && data.image.startsWith('data:image')) {
      const base64Data = data.image.split(';base64,').pop();
      const buffer = Buffer.from(base64Data, 'base64');
      const imageSizes = await processAndSaveImage(buffer, 'teams');
      data.image = imageSizes.medium;
    }
    const member = await Team.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!member) {
      throw new ApiError(404, 'Team member not found');
    }
    return member;
  }

  static async deleteTeamMember(id) {
    const member = await Team.findByIdAndDelete(id);
    if (!member) {
      throw new ApiError(404, 'Team member not found');
    }
    return member;
  }
}
