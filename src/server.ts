/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config/index';

process.on('uncaughtException', error => {
  console.log('uncaughtException', error);
  // errLogger.error(error);
  process.exit(1);
});

let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log(`🛢   Database is connected successfully`);
    // logger.info(`🛢   Database is connected successfully`);
    server = app.listen(config.port, () => {
      console.log(`Application  listening on port ${config.port}`);
      // logger.info(`Application  listening on port ${config.port}`);
    });
  } catch (err) {
    console.log('Failed to connect database');
    // errLogger.error('Failed to connect database', err);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        console.log('something went wrong!', error);

        // errLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

process.on('SIGTERM', () => {
  console.log('SIGTERM is received');

  // logger.info('SIGTERM is received');
  if (server) {
    server.close();
  }
});
