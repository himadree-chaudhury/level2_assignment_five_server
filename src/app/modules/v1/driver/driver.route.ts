import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { validateRequest } from "../../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { DriverController } from "./driver.controller";
import { driverValidationSchema, updateLocationValidationSchema } from "./driver.validation";

export const driverRoutes = Router();

driverRoutes.post(
  "/register",
  checkAuth(UserRole.RIDER, UserRole.ADMIN),
  validateRequest(driverValidationSchema),
  DriverController.registerDriver
);
driverRoutes.patch(
  "/approve/:driverId",
  checkAuth(UserRole.ADMIN),
  DriverController.approveDriver
);
driverRoutes.patch(
  "/availability/:driverId",
  checkAuth(UserRole.DRIVER, UserRole.ADMIN),
  DriverController.toggleAvailability
);
driverRoutes.patch(
  "/update-location/:driverId",
    checkAuth(UserRole.DRIVER, UserRole.ADMIN),
  validateRequest(updateLocationValidationSchema),
  DriverController.updateLocation
);
