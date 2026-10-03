import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';
import { env } from './env.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

const maxSizeBytes = Number(env.UPLOAD_MAX_SIZE_MB) * 1024 * 1024;

export const upload = multer({
  storage,
  limits: {
    fileSize: maxSizeBytes,
  },
  fileFilter,
});
