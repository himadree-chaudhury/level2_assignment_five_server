import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { validateRequest } from "../../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { RideController } from "./ride.controller";
import { rideValidationSchema } from "./ride.validation";

export const rideRoutes = Router();

rideRoutes.post(
  "/request",
  checkAuth(UserRole.RIDER),
  validateRequest(rideValidationSchema),
  RideController.createRide
);
rideRoutes.patch(
  "/accept/:rideId",
  checkAuth(UserRole.DRIVER),
  RideController.acceptRide
);
rideRoutes.patch(
  "/cancel/:rideId",
  checkAuth(UserRole.RIDER, UserRole.DRIVER),
  RideController.cancelRide
);
rideRoutes.patch(
  "/pickup/:rideId",
  checkAuth(UserRole.DRIVER),
  RideController.pickupRide
);
rideRoutes.patch(
  "/complete/:rideId",
  checkAuth(UserRole.DRIVER),
  RideController.completeRide
);
rideRoutes.get(
  "/all",
  checkAuth(UserRole.RIDER, UserRole.DRIVER, UserRole.ADMIN),
  RideController.getAllRides
);
rideRoutes.get(
  "/:rideId",
  checkAuth(UserRole.RIDER, UserRole.DRIVER),
  RideController.getRideByHistory
);
