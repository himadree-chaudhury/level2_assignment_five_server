import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { asyncTryCatch } from "../../../utils/asyncTryCatch";
import { genericResponse } from "../../../utils/genericResponse";
import { RideService } from "./ride.service";

const createRide = asyncTryCatch(async (req: Request, res: Response) => {
  const rideData = req.body;
  const riderId = req.authUser?.userId;
  const ride = await RideService.createRide({ ...rideData, riderId });

  genericResponse(res, {
    success: true,
    status: httpStatus.CREATED,
    message: "Ride created successfully",
    data: ride,
  });
});

const acceptRide = asyncTryCatch(async (req: Request, res: Response) => {
  const driverId = req.authUser?.userId;
  const rideId = req.params.rideId;

  const ride = await RideService.acceptRide(driverId, rideId);

  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Ride accepted successfully",
    data: ride,
  });
});

const cancelRide = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.authUser?.userId;
  const userRole = req.authUser?.role;
  const rideId = req.params.rideId;

  const ride = await RideService.cancelRide(userId, userRole, rideId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Ride canceled successfully",
    data: ride,
  });
});

const pickupRide = asyncTryCatch(async (req: Request, res: Response) => {
  const driverId = req.authUser?.userId;
  const rideId = req.params.rideId;

  const ride = await RideService.pickupRide(driverId, rideId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Ride picked up successfully",
    data: ride,
  });
});

const transitRide = asyncTryCatch(async (req: Request, res: Response) => {
  const driverId = req.authUser?.userId;
  const rideId = req.params.rideId;

  const ride = await RideService.transitRide(driverId, rideId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Ride is now in transit",
    data: ride,
  });
});

const completeRide = asyncTryCatch(async (req: Request, res: Response) => {
  const driverId = req.authUser?.userId;
  const rideId = req.params.rideId;

  const ride = await RideService.completeRide(driverId, rideId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Ride completed successfully",
    data: ride,
  });
});

const getRideByHistory = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.authUser?.userId;
  const rideId = req.params.rideId;

  const ride = await RideService.getRideByHistory(userId, rideId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Ride retrieved successfully",
    data: ride,
  });
});
const getAllRides = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.authUser?.userId;
  const rides = await RideService.getAllRides(userId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Rides retrieved successfully",
    data: rides,
  });
});

export const RideController = {
  createRide,
  acceptRide,
  cancelRide,
  pickupRide,
  transitRide,
  completeRide,
  getRideByHistory,
  getAllRides,
};
