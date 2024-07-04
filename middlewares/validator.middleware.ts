import { NextFunction, Request } from "express";
import { catchAsync, pick } from "../utils";
import { ValidateSchemaType } from "../types";
import { BadRequestError } from "../constants";

export const validateMiddleware  = (schema: ValidateSchemaType) => catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const object = pick(req, Object.keys(schema));
  for (const key in schema) {
    const value = object[key];
    // @ts-ignore This is a valid key
    const { success, data, error } = await schema[key].safeParseAsync(value);
    if (!success) {
      throw new BadRequestError(error.issues);
    }
    Object.assign(req, { [key]: data });
  }
  return next();
});
