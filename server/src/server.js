import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const PORT = env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Maidslife Backend Server running in [${env.NODE_ENV}] mode on http://localhost:${PORT}`);
  });

  // Graceful Shutdown
  const gracefulShutdown = (signal) => {
    console.log(`\n⚠️ Received ${signal}. Shutting down HTTP server gracefully...`);
    server.close(() => {
      console.log('🛑 HTTP server closed. Exiting process.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception thrown:', err);
    process.exit(1);
  });
};

startServer();
