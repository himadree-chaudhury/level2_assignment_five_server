import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { validateRequest } from "../../../middlewares/validateRequest";
import { userController } from "./user.controller";
import { UserRole } from "./user.interface";
import { userValidationSchema } from "./user.validation";

export const userRoutes = Router();

userRoutes.post(
  "/register",
  validateRequest(userValidationSchema),
  userController.credentialRegister
);
userRoutes.get("/", checkAuth(UserRole.ADMIN), userController.getAllUsers);
userRoutes.get("/me/:userId", checkAuth(...Object.values(UserRole)), userController.getUserById);
userRoutes.patch(
  "/block/:userId",
  checkAuth(UserRole.ADMIN),
  userController.blockUser
);
userRoutes.patch(
  "/unblock/:userId",
  checkAuth(UserRole.ADMIN),
  userController.unblockUser
);
