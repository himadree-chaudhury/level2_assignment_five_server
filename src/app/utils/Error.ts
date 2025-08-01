import httpStatus from "http-status-codes";
import { getTraceId } from "./traceId";

const formatError = (err: any) => {
  const traceId = getTraceId();

  const error = {
    success: false,
    message: err.message ? err.message : "Internal Server Error",
    trace_id: traceId,
    errors: err.errors || [],
    hints: err.hints
      ? `${err.hints} If the problem is not resolved, please feel free to contact our technical team with the trace_id.`
      : "Please Create a support ticket with the trace_id for further assistance. or contact our technical team with the trace_id.",
  };
  return error;
};

export class CustomError {
  constructor(public err: any) {
    this.err = err;
  }

  static notFound(err: any) {
    const error = formatError(err);
    return {
      status: httpStatus.NOT_FOUND,
      ...error,
    };
  }

  static unauthorized(err: any) {
    const error = formatError(err);
    return {
      status: httpStatus.UNAUTHORIZED,
      ...error,
    };
  }

  static badRequest(err: any) {
    const error = formatError(err);
    return {
      status: httpStatus.BAD_REQUEST,
      ...error,
    };
  }

  static internalServerError(err: any) {
    const error = formatError(err);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      ...error,
    };
  }

  static forbidden(err: any) {
    const error = formatError(err);
    return {
      status: httpStatus.FORBIDDEN,
      ...error,
    };
  }

  static conflict(err: any) {
    const error = formatError(err);
    return {
      status: httpStatus.CONFLICT,
      ...error,
    };
  }

  static throwError(err: any) {
    return {
      success: false,
      statusC: err.status || httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
      errors: err.errors || [],
      hints:
        err.hints ||
        "Please contact support with the trace_id for further assistance.",
    };
  }
}
