import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { asyncTryCatch } from "../../../utils/asyncTryCatch";
import { genericResponse } from "../../../utils/genericResponse";
import { StatService } from "./stat.service";

const getUsersStats = asyncTryCatch(async (req: Request, res: Response) => {
  const usersStats = await StatService.getUsersStats();
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Users statistics retrieved successfully",
    data: usersStats,
  });
});

const getDriversStats = asyncTryCatch(async (req: Request, res: Response) => {
  const driversStats = await StatService.getDriversStats();
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Drivers statistics retrieved successfully",
    data: driversStats,
  });
});

const getRidesStats = asyncTryCatch(async (req: Request, res: Response) => {
  const ridesStats = await StatService.getRidesStats();
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Rides statistics retrieved successfully",
    data: ridesStats,
  });
});

const getRiderStats = asyncTryCatch(async (req: Request, res: Response) => {
  const riderId = req.authUser?.userId;
  const riderStats = await StatService.getRiderStats(riderId);
 
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Rider statistics retrieved successfully",
    data: riderStats,
  });
});

const getDriverStats = asyncTryCatch(async (req: Request, res: Response) => {
  const driverId = req.authUser?.userId;
  const driverStats = await StatService.getDriverStats(driverId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Driver statistics retrieved successfully",
    data: driverStats,
  });
});

export const StatController = {
  getUsersStats,
  getDriversStats,
  getRidesStats,
  getRiderStats,
  getDriverStats,
};
