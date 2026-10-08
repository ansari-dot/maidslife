import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGO_URI: z.string().default('mongodb://127.0.0.1:27017/maidslife'),
  JWT_ACCESS_SECRET: z.string().min(8, 'JWT Access secret must be at least 8 characters'),
  JWT_REFRESH_SECRET: z.string().min(8, 'JWT Refresh secret must be at least 8 characters'),
  ACCESS_TOKEN_EXPIRY: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRY: z.string().default('7d'),
  COOKIE_DOMAIN: z.string().default('localhost'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default('Maidslife Admin <noreply@maidslife.com>'),
  UPLOAD_MAX_SIZE_MB: z.string().default('8'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  ZIINA_MODE: z.enum(['test', 'production']).default('test'),
  ZIINA_BASE_URL: z.string().default('https://api-v2.ziina.com/api'),
  ZIINA_API_KEY: z.string().optional(),
  ZIINA_PROD_API_KEY: z.string().optional(),
  ZIINA_WEBHOOK_SECRET: z.string().optional(),
  ADMIN_EMAIL: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
