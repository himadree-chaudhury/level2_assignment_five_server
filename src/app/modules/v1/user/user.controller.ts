import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { asyncTryCatch } from "../../../utils/asyncTryCatch";
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
  const tokenUserId = req.authUser?.userId;
  const user = await userService.getUserById(tokenUserId, userId);
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
