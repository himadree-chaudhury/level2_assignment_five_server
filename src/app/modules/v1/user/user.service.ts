import bcrypt from "bcryptjs";
import envVariables from "../../../config/env";
import { CustomError } from "../../../utils/error";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const credentialRegister = async (payload: Partial<IUser>) => {
  const hashedPassword = await bcrypt.hash(
    payload.password as string,
    envVariables.BCRYPT_SALT_ROUNDS
  );
  const userPayload: Partial<IUser> = {
    ...payload,
    password: hashedPassword,
    auths: [
      {
        provider: "local",
        providerId: payload.email as string,
      },
    ],
  };

  const user = await User.create(userPayload);
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    phone: user.phone,
    role: user.role,
    isBlocked: user.isBlocked,
    isVerified: user.isVerified,
  };
};

const getAllUsers = async () => {
  const users = await User.find().select("-password -auths").lean();
  return users;
};

const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select("-password -auths").lean();
  if (!user) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }
  return user;
};

const blockUser = async (userId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isBlocked: true },
    { new: true }
  );
  if (!user) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }
};

const unblockUser = async (userId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isBlocked: false },
    { new: true }
  );
  if (!user) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }
};

export const userService = {
  credentialRegister,
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
};
