import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { asyncTryCatch } from "../../../utils/asyncTryCatch";
import { genericResponse } from "../../../utils/genericResponse";
import { DriverService } from "./driver.service";

const registerDriver = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.authUser?.userId;
  const driver = await DriverService.registerDriver({ ...req.body, userId });
  genericResponse(res, {
    success: true,
    status: httpStatus.CREATED,
    message: "Driver registered successfully",
    data: driver,
  });
});

const getDriverById = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.authUser?.userId;
  const driver = await DriverService.getDriverById(userId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Driver retrieved successfully",
    data: driver,
  });
});

const getAllDrivers = asyncTryCatch(async (req: Request, res: Response) => {
  const drivers = await DriverService.getAllDrivers();
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Drivers retrieved successfully",
    data: drivers,
  });
});

const toggleApproveDriver = asyncTryCatch(async (req: Request, res: Response) => {
  const driverId = req.params.driverId;
  const driver = await DriverService.toggleApproveDriver(driverId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Driver approved successfully",
    data: driver,
  });
});

const toggleSuspendDriver = asyncTryCatch(
  async (req: Request, res: Response) => {
    const driverId = req.params.driverId;
    const driver = await DriverService.toggleSuspendDriver(driverId);
    genericResponse(res, {
      success: true,
      status: httpStatus.OK,
      message: "Driver suspended successfully",
      data: driver,
    });
  }
);

const toggleAvailability = asyncTryCatch(
  async (req: Request, res: Response) => {
    const driverId = req.authUser?.userId;
    const driver = await DriverService.toggleAvailability(driverId);
    genericResponse(res, {
      success: true,
      status: httpStatus.OK,
      message: `${
        driver ? "Driver is now available" : "Driver is now unavailable"
      }`,
    });
  }
);
const updateLocation = asyncTryCatch(async (req: Request, res: Response) => {
  const driverId = req.authUser?.userId;
  const location = req.body;
  const driver = await DriverService.updateLocation(driverId, location);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Driver location updated successfully",
    data: driver,
  });
});

export const DriverController = {
  registerDriver,
  getDriverById,
  getAllDrivers,
  toggleApproveDriver,
  toggleSuspendDriver,
  toggleAvailability,
  updateLocation,
};
