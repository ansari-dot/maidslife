import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { SitemapStream, streamToPromise } from 'sitemap';

import { env } from './config/env.js';
import { swaggerUi, swaggerSpec } from './config/swagger.js';
import { notFoundHandler } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { apiLimiter } from './middlewares/rateLimiter.middleware.js';
import morgan from 'morgan';

// Import Feature Module Routers
import authRoutes from './modules/auth/auth.routes.js';
import categoryRoutes from './modules/categories/category.routes.js';
import serviceRoutes from './modules/services/service.routes.js';

import addonRoutes from './modules/addons/addon.routes.js';
import bookingRoutes from './modules/bookings/booking.routes.js';
import cleanerRoutes from './modules/cleaners/cleaner.routes.js';
import customerRoutes from './modules/customers/customer.routes.js';
import couponRoutes from './modules/coupons/coupon.routes.js';
import galleryRoutes from './modules/gallery/gallery.routes.js';
import reportRoutes from './modules/reports/reports.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import paymentRoutes from './modules/payments/payment.routes.js';
import testimonialRoutes from './modules/testimonials/testimonial.routes.js';
import teamRoutes from './modules/teams/team.routes.js';
import uploadRoutes from './modules/upload/upload.routes.js';
import jobRoutes from './modules/jobs/job.routes.js';

import { Service } from './modules/services/service.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1); // Trust first proxy (Nginx) to fetch real IP
app.use(morgan('dev'));

// 1. Global Security & Parsing Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: [
      env.CLIENT_URL,
      env.ADMIN_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'https://maidslife.com',
      'https://www.maidslife.com',
      'https://admin.maidslife.com'
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(apiLimiter);

// 2. Serve Static Uploaded Files (Removed - Using Cloudinary)

// 3. Swagger API Documentation UI Endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 4. Healthcheck Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Sitemap Endpoint
app.get('/sitemap.xml', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }, 'slug');

    const sitemap = new SitemapStream({
      hostname: env.CLIENT_URL || 'https://yourwebsite.com',
    });

    sitemap.write({ url: '/', changefreq: 'weekly', priority: 1.0 });
    sitemap.write({ url: '/services', changefreq: 'weekly', priority: 0.9 });
    sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.8 });
    sitemap.write({ url: '/contact', changefreq: 'monthly', priority: 0.7 });
    sitemap.write({ url: '/careers', changefreq: 'monthly', priority: 0.7 });

    for (const service of services) {
      sitemap.write({
        url: `/service/${service.slug}`,
        changefreq: 'weekly',
        priority: 0.8,
      });
    }

    sitemap.end();
    const data = await streamToPromise(sitemap);

    res.header('Content-Type', 'application/xml');
    res.send(data.toString());
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to generate sitemap');
  }
});

// 4. Feature Modules API v1 Routes
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/categories`, categoryRoutes);
app.use(`${API_PREFIX}/services`, serviceRoutes);

app.use(`${API_PREFIX}/addons`, addonRoutes);
app.use(`${API_PREFIX}/bookings`, bookingRoutes);
app.use(`${API_PREFIX}/cleaners`, cleanerRoutes);
app.use(`${API_PREFIX}/customers`, customerRoutes);
app.use(`${API_PREFIX}/coupons`, couponRoutes);
app.use(`${API_PREFIX}/gallery`, galleryRoutes);
app.use(`${API_PREFIX}/reports`, reportRoutes);
app.use(`${API_PREFIX}/settings`, settingsRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);
app.use(`${API_PREFIX}/testimonials`, testimonialRoutes);
app.use(`${API_PREFIX}/teams`, teamRoutes);
app.use(`${API_PREFIX}/jobs`, jobRoutes);
app.use(`${API_PREFIX}/upload`, uploadRoutes);
app.get(`${API_PREFIX}/marketing`, (req, res) => {
  res.status(200).json({ success: true, data: { welcomePopup: null } });
});

// 5. 404 & Global Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
