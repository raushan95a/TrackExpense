import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';
import { seedDefaultCategories } from './services/category.service.js';

const SHUTDOWN_SIGNALS = ['SIGINT', 'SIGTERM'];

const start = async () => {
  await connectDB();
  await seedDefaultCategories();

  const server = app.listen(env.port, () => {
    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down gracefully`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  SHUTDOWN_SIGNALS.forEach((signal) => process.on(signal, () => shutdown(signal)));

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
    server.close(() => process.exit(1));
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
