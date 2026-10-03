import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

// Valid 1x1 WebP base64 string
const base64Webp = 'UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v3AgAA=';
const webpBuffer = Buffer.from(base64Webp, 'base64');

const filesToCreate = [
  'services/service-1-full.webp',
  'services/service-2-full.webp',
  'services/service-3-full.webp',
  'services/service-4-full.webp',
  'services/service-5-full.webp',
  'services/service-6-full.webp',
  'cleaners/cleaner-1-medium.webp',
  'cleaners/cleaner-2-medium.webp',
  'cleaners/cleaner-3-medium.webp',
  'cleaners/cleaner-4-medium.webp',
  'cleaners/cleaner-5-medium.webp',
  'cleaners/cleaner-6-medium.webp',
  'cleaners/cleaner-7-medium.webp',
  'gallery/gallery-1-before.webp',
  'gallery/gallery-1-after.webp',
  'gallery/gallery-2-before.webp',
  'gallery/gallery-2-after.webp',
  'gallery/gallery-3-before.webp',
  'gallery/gallery-3-after.webp',
  'gallery/gallery-4-before.webp',
  'gallery/gallery-4-after.webp',
  'gallery/gallery-5-before.webp',
  'gallery/gallery-5-after.webp',
  'gallery/gallery-6-before.webp',
  'gallery/gallery-6-after.webp',
];

const seedUploads = async () => {
  for (const relPath of filesToCreate) {
    const fullPath = path.join(uploadsDir, relPath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, webpBuffer);
    console.log(`Created uploaded file: ${relPath}`);
  }
  console.log('✅ All backend uploaded file assets created successfully!');
};

seedUploads();
