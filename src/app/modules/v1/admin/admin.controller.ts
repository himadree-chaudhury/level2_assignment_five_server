import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { asyncTryCatch } from "../../../utils/asyncTryCatch";
import { genericResponse } from "../../../utils/genericResponse";
import { AdminService } from "./admin.service";

const getUsersStats = asyncTryCatch(async (req: Request, res: Response) => {
  const usersStats = await AdminService.getUsersStats();
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Users statistics retrieved successfully",
    data: usersStats,
  });
});

const getDriversStats = asyncTryCatch(async (req: Request, res: Response) => {
  const driversStats = await AdminService.getDriversStats();
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Drivers statistics retrieved successfully",
    data: driversStats,
  });
});

const getRidesStats = asyncTryCatch(async (req: Request, res: Response) => {
  const ridesStats = await AdminService.getRidesStats();
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Rides statistics retrieved successfully",
    data: ridesStats,
  });
});

export const AdminController = {
  getUsersStats,
  getDriversStats,
  getRidesStats,
};
