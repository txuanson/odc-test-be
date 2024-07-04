import { BaseController } from "../abstraction";
import swagerUi from "swagger-ui-express";
import yaml from "yaml";
import fs from "fs";

export class DocsController extends BaseController {
  public path: string = "/docs";
  public name: string = DocsController.name;

  constructor() {
    super();
  }

  initializeRoutes(): void {
    const file = fs.readFileSync(__dirname + "/../docs.yaml", "utf-8");
    const swaggerDocument = yaml.parse(file);
    this.router.use("/", swagerUi.serve);
    this.router.get("/", swagerUi.setup(swaggerDocument));
    this.app.logger.info(`Swagger api document initialized at http://localhost:${this.app.port}/docs`);
  }
}