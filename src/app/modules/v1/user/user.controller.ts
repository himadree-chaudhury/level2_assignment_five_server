import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { asyncTryCatch } from "../../../utils/asyncTryCatch";
import { CustomError } from "../../../utils/error";
import { genericResponse } from "../../../utils/genericResponse";
import { userService } from "./user.service";

const credentialRegister = asyncTryCatch(
  async (req: Request, res: Response) => {
    const user = await userService.credentialRegister(req.body);
    genericResponse(res, {
      success: true,
      status: httpStatus.CREATED,
      message: "User registered successfully",
      data: user,
    });
  }
);

const getAllUsers = asyncTryCatch(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Users retrieved successfully",
    data: users,
  });
});

const getUserById = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const tokenUser: any = req.user;
  if (!tokenUser || !tokenUser.userId) {
    const error = CustomError.unauthorized({
      message: "Unauthorized access",
      errors: ["User not authenticated"],
      hints: "Please login to access this resource.",
    });
    throw error;
  }
  if (userId !== tokenUser.userId) {
    const error = CustomError.forbidden({
      message: "You are not allowed to access this user",
      errors: ["Insufficient permissions"],
      hints: "Please check your permissions and try again.",
    });
    throw error;
  }
  const user = await userService.getUserById(userId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "User retrieved successfully",
    data: user,
  });
});

const blockUser = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  await userService.blockUser(userId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "User blocked successfully",
  });
});

const unblockUser = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  await userService.unblockUser(userId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "User unblocked successfully",
  });
});

export const userController = {
  credentialRegister,
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
};
