import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { validateRequest } from "../../../middlewares/validateRequest";
import { userController } from "./user.controller";
import { UserRole } from "./user.interface";
import { userValidationSchema } from "./user.validation";

export const userRoute = Router();

userRoute.post(
  "/register",
  validateRequest(userValidationSchema),
  userController.credentialRegister
);
userRoute.get("/", checkAuth(UserRole.ADMIN), userController.getAllUsers);
userRoute.get("/:userId", checkAuth(...Object.values(UserRole)), userController.getUserById);
userRoute.patch(
  "/block/:userId",
  checkAuth(UserRole.ADMIN),
  userController.blockUser
);
userRoute.patch(
  "/unblock/:userId",
  checkAuth(UserRole.ADMIN),
  userController.unblockUser
);
