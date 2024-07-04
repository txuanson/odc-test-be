import { NextFunction, Request, Response } from "express";
import { ApiError, STATUS_CODE } from "../constants";
import dotenv from "dotenv";
dotenv.config();

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction ) => {
  if (error instanceof ApiError) {
    return res.status(error.getCode()).send({
      message: error.nativeMsg,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack?.split("\n    ") }),
    });
  }

  res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send({
    message: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack?.split("\n    ") }),
  });
}