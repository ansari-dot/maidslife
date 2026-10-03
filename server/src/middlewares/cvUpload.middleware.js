import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ApiError } from '../utils/ApiError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * CVs contain personal data, so they are stored OUTSIDE the public /uploads
 * static folder and are only served through an authenticated admin endpoint.
 */
export const CV_UPLOAD_DIR = path.join(__dirname, '../../private/cvs');
if (!fs.existsSync(CV_UPLOAD_DIR)) {
  fs.mkdirSync(CV_UPLOAD_DIR, { recursive: true });
}

const MAX_CV_SIZE = 5 * 1024 * 1024; // 5 MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, CV_UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `cv-${uniqueSuffix}.pdf`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf' && file.mimetype === 'application/pdf') {
    return cb(null, true);
  }
  cb(new ApiError(400, 'CV must be a PDF file (.pdf).'), false);
};

const multerCv = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_CV_SIZE, files: 1 },
}).single('cv');

/**
 * Wraps multer so its errors become clean 400 responses, and verifies the
 * uploaded file really is a PDF by checking the "%PDF" magic bytes
 * (mimetype/extension alone can be spoofed).
 */
export const uploadCv = (req, res, next) => {
  multerCv(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(400, 'CV file is too large. Maximum size is 5 MB.'));
      }
      return next(err instanceof ApiError ? err : new ApiError(400, err.message));
    }

    if (!req.file) {
      return next(new ApiError(400, 'Please attach your CV as a PDF file.'));
    }

    try {
      const fd = fs.openSync(req.file.path, 'r');
      const header = Buffer.alloc(4);
      fs.readSync(fd, header, 0, 4, 0);
      fs.closeSync(fd);

      if (header.toString('ascii') !== '%PDF') {
        fs.unlink(req.file.path, () => {});
        return next(new ApiError(400, 'Invalid file. CV must be a valid PDF document.'));
      }
    } catch (e) {
      fs.unlink(req.file.path, () => {});
      return next(new ApiError(400, 'Could not read uploaded CV file.'));
    }

    next();
  });
};
