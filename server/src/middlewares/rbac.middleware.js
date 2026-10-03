import { ApiError } from '../utils/ApiError.js';

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ApiError(401, 'User identity not verified'));
    }

    if (req.user.role === 'admin' || req.user.role === 'super_admin') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied. Role '${req.user.role}' is not authorized to perform this operation.`
        )
      );
    }

    next();
  };
};
