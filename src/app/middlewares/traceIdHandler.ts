// middleware/traceId.ts
import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import { setTraceId } from "../utils/traceId";

// 🔁 Request → 🧠 traceId created → ❌ error occurs → 📁 error traceId saved → 📤 sent to user → 🕵️‍♂️ traceable forever

export const traceIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const incomingTraceId = req.headers["x-trace-id"]?.toString();
    const traceId = incomingTraceId || randomUUID();

  setTraceId(traceId);
  next();
};
