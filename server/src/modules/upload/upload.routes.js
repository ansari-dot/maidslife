import express from 'express';
import { upload } from '../../config/cloudinary.js';

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'No image uploaded' });
    }
    
    // The image is automatically uploaded to Cloudinary by multer-storage-cloudinary
    // The optimized URL is available in req.file.path
    res.status(200).json({
      status: 'success',
      data: {
        url: req.file.path,
        filename: req.file.filename
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
