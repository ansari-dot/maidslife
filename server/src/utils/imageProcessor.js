import { cloudinary } from '../config/cloudinary.js';

export const processAndSaveImage = async (fileBuffer, folderName = 'general') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `maidslife/${folderName}`,
        format: 'webp',
        quality: 'auto:best',
      },
      (error, result) => {
        if (error) return reject(error);

        // We generate optimized URLs on the fly using Cloudinary's transformation engine
        // This maintains compatibility with the existing DB schema that expects { thumb, medium, full }
        const thumb = cloudinary.url(result.public_id, { width: 200, crop: 'scale', fetch_format: 'auto' });
        const medium = cloudinary.url(result.public_id, { width: 800, crop: 'scale', fetch_format: 'auto' });
        
        resolve({
          thumb: thumb,
          medium: medium,
          full: result.secure_url,
        });
      }
    );
    
    // Pipe the buffer to Cloudinary
    uploadStream.end(fileBuffer);
  });
};
