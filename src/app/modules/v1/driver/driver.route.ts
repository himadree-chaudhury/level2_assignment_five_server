import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { validateRequest } from "../../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { DriverController } from "./driver.controller";
import {
  driverValidationSchema,
  updateLocationValidationSchema,
} from "./driver.validation";

export const driverRoutes = Router();

driverRoutes.post(
  "/register",
  checkAuth(UserRole.RIDER),
  validateRequest(driverValidationSchema),
  DriverController.registerDriver
);
driverRoutes.get(
  "/me",
  checkAuth(UserRole.DRIVER, UserRole.RIDER),
  DriverController.getDriverById
);
driverRoutes.get(
  "/",
  checkAuth(UserRole.ADMIN),
  DriverController.getAllDrivers
);
driverRoutes.patch(
  "/approve/:driverId",
  checkAuth(UserRole.ADMIN),
  DriverController.toggleApproveDriver
);
driverRoutes.patch(
  "/suspend/:driverId",
  checkAuth(UserRole.ADMIN),
  DriverController.toggleSuspendDriver
);

driverRoutes.patch(
  "/availability",
  checkAuth(UserRole.DRIVER),
  DriverController.toggleAvailability
);
driverRoutes.patch(
  "/update-location",
  checkAuth(UserRole.DRIVER),
  validateRequest(updateLocationValidationSchema),
  DriverController.updateLocation
);
