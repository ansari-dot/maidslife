import winston from 'winston';
import { env } from '../config/env.js';

const isProd = env.NODE_ENV === 'production';

// Production format: structured JSON for Datadog, CloudWatch, Loki, ELK
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Development format: colorized, readable console output
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
  })
);

export const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  format: isProd ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console()
  ],
  exitOnError: false,
});

// Stream adapter for morgan integration
export const morganStream = {
  write: (message) => {
    logger.info(message.trim());
  },
};
