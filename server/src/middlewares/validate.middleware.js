import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errorMessages = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
      return next(new ApiError(400, 'Validation Error', errorMessages));
    }

    // Assign sanitized data back
    req.body = result.data.body || req.body;
    req.query = result.data.query || req.query;
    req.params = result.data.params || req.params;

    next();
  };
};
