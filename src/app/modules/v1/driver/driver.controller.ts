import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { asyncTryCatch } from "../../../utils/asyncTryCatch";
import { genericResponse } from "../../../utils/genericResponse";
import { DriverService } from "./driver.service";

const registerDriver = asyncTryCatch(async (req: Request, res: Response) => {
  const driver = await DriverService.registerDriver(req.body);
  genericResponse(res, {
    success: true,
    status: httpStatus.CREATED,
    message: "Driver registered successfully",
    data: driver,
  });
});

const approveDriver = asyncTryCatch(async (req: Request, res: Response) => {
  const driverId = req.params.driverId;
  const driver = await DriverService.approveDriver(driverId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Driver approved successfully",
    data: driver,
  });
});

const toggleAvailability = asyncTryCatch(
  async (req: Request, res: Response) => {
    const driverId = req.params.driverId;
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
  const driverId = req.params.driverId;
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
  approveDriver,
  toggleAvailability,
  updateLocation,
};
