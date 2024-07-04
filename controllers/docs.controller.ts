import { BaseController } from "../abstraction";

export class DocsController extends BaseController {
  public path: string = "/docs";
  public name: string = DocsController.name;

  constructor() {
    super();
  }

  initializeRoutes(): void {
    this.router.get("/", (req, res) => {
      res.send("Welcome to the API documentation");
    });
  }
}