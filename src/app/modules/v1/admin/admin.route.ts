import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { AdminController } from "./admin.controller";

export const adminRoutes = Router();

adminRoutes.get(
  "/stat/users",
  checkAuth(UserRole.ADMIN),
  AdminController.getUsersStats
);
adminRoutes.get(
  "/stat/drivers",
  checkAuth(UserRole.ADMIN),
  AdminController.getDriversStats
);
adminRoutes.get(
  "/stat/rides",
  checkAuth(UserRole.ADMIN),
  AdminController.getRidesStats
);
