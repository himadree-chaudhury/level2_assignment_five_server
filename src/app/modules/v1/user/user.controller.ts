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
  const userId = req.authUser?.userId;
  const user = await userService.getUserById(userId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "User retrieved successfully",
    data: user,
  });
});

const updateUser = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.authUser?.userId;
  const updatedUser = await userService.updateUser(userId, req.body);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "User updated successfully",
    data: updatedUser,
  });
});
const addSosContact = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.authUser?.userId;
  const updatedUser = await userService.addSosContact(userId, req.body);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "SOS contact added successfully",
    data: updatedUser,
  });
});

const updateSosContact = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.authUser?.userId;
  const contactId = req.params?.contactId;
  const updatedUser = await userService.updateSosContact(userId, contactId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "SOS contact updated successfully",
    data: updatedUser,
  });
});
const deleteSosContact = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.authUser?.userId;
  const contactId = req.params?.contactId;
  const updatedUser = await userService.deleteSosContact(userId, contactId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "SOS contact deleted successfully",
    data: updatedUser,
  });
});

const verifyRequestUser = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.authUser?.userId;
  const verifiedUser = await userService.verifyRequestUser(userId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "User verification request sent successfully",
    data: verifiedUser,
  });
});
const verifyUser = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.authUser?.userId;
  const verificationCode = req.body;
  const verifiedUser = await userService.verifyUser(userId, verificationCode);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "User verified successfully",
    data: verifiedUser,
  });
});

const blockUser = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const blockedUser = await userService.blockUser(userId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "User blocked successfully",
    data: blockedUser,
  });
});

const unblockUser = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const unblockedUser = await userService.unblockUser(userId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "User unblocked successfully",
    data: unblockedUser,
  });
});

const deleteUser = asyncTryCatch(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const deletedUser = await userService.deleteUser(userId);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "User deleted successfully",
    data: deletedUser,
  });
});

export const userController = {
  credentialRegister,
  getAllUsers,
  getUserById,
  updateUser,
  addSosContact,
  updateSosContact,
  deleteSosContact,
  verifyRequestUser,
  verifyUser,
  blockUser,
  unblockUser,
  deleteUser,
};
