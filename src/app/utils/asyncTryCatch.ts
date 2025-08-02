/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";

export const asyncTryCatch = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch((error: any) => {
        next(error);
    });
  };
};
