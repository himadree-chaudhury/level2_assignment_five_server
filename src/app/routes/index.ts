import { Router } from "express";
import { authRoutes } from "../modules/v1/auth/auth.route";
import { userRoute } from "../modules/v1/user/user.routes";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
