import dotenv from 'dotenv';
import App from './app';
import { BaseController } from './abstraction';
import { DocsController, TaskController } from './controllers';
import { AppDataSource } from './database';

dotenv.config();
const port = parseInt(process.env.PORT || "8080");

// Always set NODE_ENV to production by default
// This is to prevent the app from running in development mode in production by mistake
const nodeEnv = process.env.NODE_ENV || "production";

// It is better to contruct the controllers array dynamically in App.ts <initializeControllers>
// But for now, we will hardcode the controllers as we facing <type any> issue
const controllers: BaseController[] = [
  new TaskController()
];

if (nodeEnv === 'development') {
  controllers.push(new DocsController());
}

const app = new App(controllers, port, AppDataSource);
app.init();
app.listen();


const unexpectedErrorHandler = (error: Error) => {
  app.logger.error(error);
  app.close()
  process.exit(1);
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  app.logger.info('SIGTERM received');
  app.close();
});

process.on('SIGINT', () => {
  app.logger.info('SIGINT received');
  app.close();
});

export default app;