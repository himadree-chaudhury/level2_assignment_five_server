import { Router } from "express";
import { adminRoutes } from "../modules/v1/admin/admin.route";
import { authRoutes } from "../modules/v1/auth/auth.route";
import { driverRoutes } from "../modules/v1/driver/driver.route";
import { rideRoutes } from "../modules/v1/ride/ride.route";
import { userRoutes } from "../modules/v1/user/user.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/driver",
    route: driverRoutes,
  },
  {
    path: "/ride",
    route: rideRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
