import { Router } from "express";
import App from "../app";

export abstract class BaseController {
  abstract path: string;
  abstract name: string;
  
  public app: App;
  public router: Router = Router();
  
  abstract initializeRoutes(): void;
}