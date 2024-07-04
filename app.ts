import express, { Application } from "express";
import { DataSource } from "typeorm";
import { BaseController } from "./abstraction";
import cors from "cors";
import { errorHandler } from "./middlewares";
import { logger } from "./utils";
import { Logger } from "winston";
import { Server } from "http";

export default class App {
  public app: Application;
  public server: Server;
  public logger: Logger;

  constructor(
    public controllers: BaseController[], 
    public port: number, 
    public dataSource: DataSource
  ) {
    this.app = express();
    this.logger = logger;
  }

  async init() {
    await this.initializeDataSource()
    this.initializeMiddlewares();
    this.initializeControllers(this.controllers);
    this.initializeErrorHandler();
  }

  async initializeDataSource() {
    try {
      await this.dataSource.initialize();
    } catch (error) {
      logger.error("Error initializing data source", error);
    }
  }

  private initializeControllers(controllers: BaseController[]) {
    controllers.forEach((controller) => {
      controller.app = this;
      controller.initializeRoutes();
      this.app.use(controller.path, controller.router);
      this.logger.info(`${controller.name} initialized at path ${controller.path}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeErrorHandler() {
    this.app.use(errorHandler);
  }

  public listen() {
    this.server = this.app.listen(this.port, () => {
      logger.info(`App listening on the port ${this.port}`);
    });
  }
  
  public close() {
    return new Promise<void>((resolve, reject) => {
      this.server.close(async (err) => {
        if (err) {
          reject(err);
        }
        await this.dataSource.destroy();
        this.logger.info('Server closed!');
        resolve();
      });
    });
  }
}