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
  "/rider-stats",
  checkAuth(UserRole.RIDER),
  StatController.getRiderStats
);
statRoutes.get(
  "/driver-stats",
  checkAuth(UserRole.DRIVER),
  StatController.getDriverStats
);
