import { ZodSchema } from "zod";

export type ValidateSchemaType = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}