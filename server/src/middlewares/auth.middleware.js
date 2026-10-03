import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import { User } from '../modules/auth/auth.model.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized request. Access token missing.');
  }

  try {
    const decodedToken = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const user = await User.findById(decodedToken.id).select('-passwordHash -refreshTokenHash');

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token. User not found.');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account is deactivated. Contact administrator.');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});
