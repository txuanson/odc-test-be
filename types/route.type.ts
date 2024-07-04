import { Router } from "express";

export type Route = {
  path: string;
  route: Router;
};