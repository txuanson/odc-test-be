import { BaseController } from "../abstraction";
import swagerUi from "swagger-ui-express";
import yaml from "yaml";
import fs from "fs";

const file = fs.readFileSync(__dirname + "/../docs.yaml", "utf-8");
const swaggerDocument = yaml.parse(file);

export class DocsController extends BaseController {
  public path: string = "/docs";
  public name: string = DocsController.name;

  constructor() {
    super();
  }

  initializeRoutes(): void {
    this.router.use("/", swagerUi.serve);
    this.router.get("/", swagerUi.setup(swaggerDocument));
  }
}