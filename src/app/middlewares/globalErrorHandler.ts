import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import { ZodError } from "zod";
import logger from "../config/winston";
import { getTraceId } from "../utils/traceId";
import { CustomError } from "../utils/error";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // !Get the trace ID from AsyncLocalStorage
  const traceId = getTraceId();

  let error = {
    status: err.status || 500,
    message: err.message || "Internal Server Error",
    trace_id: traceId,
    errors: err.errors || [],
    hints: err.hints,
  };

  // !Handle JWT token expiration error
  if (err.name === "TokenExpiredError") {
    error = {
      ...error,
      status: httpStatus.UNAUTHORIZED,
      message: "Token has expired.",
      hints: "Please login again to obtain a new access token.",
    };
  }

  // !Handle Zod validation errors
  else if (err instanceof ZodError) {
    error = {
      ...error,
      status: httpStatus.BAD_REQUEST,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field:
          (issue.path.length > 1 &&
            issue.path.reverse().join(" inside ") + " missing") ||
          issue.path.join(".") + " is missing",
        message: issue.message,
        code: issue.code,
      })),
      hints: "Please check the request data and try again.",
    };
  }

  // !Handle Mongoose ValidationError
  else if (err instanceof mongoose.Error.ValidationError) {
    error = {
      ...error,
      status: httpStatus.BAD_REQUEST,
      message: "Validation failed",
      errors: Object.values(err.errors).map((err: any) => ({
        field: err.path + " is missing",
        message: err.message,
        kind: err.kind,
      })),
      hints: "Please check the request data and try again.",
    };
  }

  // !Handle Mongoose CastError
  else if (err instanceof mongoose.Error.CastError) {
    error = {
      ...error,
      status: httpStatus.BAD_REQUEST,
      message: `Invalid ${err.path}: ${err.value}`,
      errors: {
        name: err.name,
        field: err.path,
        value: err.value,
        kind: err.kind,
      },
      hints: "Please ensure the value is in the correct format and try again.",
    };
  }
  // !Handle Mongoose MongoServerError (e.g., duplicate key)
  else if (err.name === "MongoServerError" && err.code === 11000) {
    error = {
      ...error,
      status: httpStatus.CONFLICT,
      message: "Duplicate key error",
      errors: {
        name: err.name,
        code: err.code,
        field: Object.keys(err.keyValue)[0],
        value: Object.values(err.keyValue)[0],
        message: `Duplicate value '${
          Object.values(err.keyValue)[0]
        }' for field '${Object.keys(err.keyValue)[0]}'`,
      },
      hints: "Please ensure the value is unique and try again.",
    };
  } else if (err instanceof CustomError) {
    error = {
      ...error,
    };
  }

  // !Log only errors with traceId
  logger.error(
    `${error.message} - Status Code: ${error.status} - Trace ID: ${traceId}`
  );

  res.status(error.status || 500).json(error);

  next(err);
};
