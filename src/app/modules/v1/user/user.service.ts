import bcrypt from "bcryptjs";
import envVariables from "../../../config/env";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { CustomError } from "../../../utils/error";

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
  return user;
};

const getAllUsers = async () => {
  const users = await User.find().select("-password -auths").lean();
  return users;
};

const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select("-password -auths").lean();
  if (!user) {
    throw CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
  }
  return user;
};

export const userService = {
  credentialRegister,
  getAllUsers,
  getUserById,
};
