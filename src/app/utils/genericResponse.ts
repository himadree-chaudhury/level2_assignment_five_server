import { Response } from "express";
import { getTraceId } from "./traceId";

interface TResponse<T> {
  success: boolean;
  status: number;
  message?: string;
  traceId?: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export const genericResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.status).json({
    success: data.success,
    status: data.status,
    message: data.message,
    traceId: getTraceId(),
    data: data.data,
    meta: data.meta,
  });
};
