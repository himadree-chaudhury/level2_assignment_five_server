import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { StatController } from "./stat.controller";

export const statRoutes = Router();

statRoutes.get(
  "/users",
  checkAuth(UserRole.ADMIN),
  StatController.getUsersStats
);
statRoutes.get(
  "/drivers",
  checkAuth(UserRole.ADMIN),
  StatController.getDriversStats
);
statRoutes.get(
  "/rides",
  checkAuth(UserRole.ADMIN),
  StatController.getRidesStats
);
statRoutes.get(
  "/rider-stats/:riderId",
  checkAuth(UserRole.RIDER, UserRole.ADMIN),
  StatController.getRiderStats
);
statRoutes.get(
  "/driver-stats/:driverId",
  checkAuth(UserRole.DRIVER, UserRole.ADMIN),
  StatController.getDriverStats
);
