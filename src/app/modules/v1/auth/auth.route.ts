import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { validateRequest } from "../../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { AuthController } from "./auth.controller";
import { authValidationSchema } from "./auth.validation";

export const authRoutes = Router();

authRoutes.post(
  "/login",
  validateRequest(authValidationSchema),
  AuthController.credentialLogin
);

authRoutes.post(
  "/logout",
  checkAuth(...Object.values(UserRole)),
  AuthController.logout
);

authRoutes.post("/refresh-token", AuthController.getNewAccessToken);
