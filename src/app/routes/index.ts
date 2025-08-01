import { Router } from "express";
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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
