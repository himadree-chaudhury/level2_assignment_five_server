import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Request } from "express";
import envVariables from "../../../config/env";
import { redisClient } from "../../../config/redis";
import { CustomError } from "../../../utils/error";
import { QueryBuilder } from "../../../utils/queryBuilder";
import { sendMail } from "../../../utils/sendMail";
import { IContact, IUser } from "./user.interface";
import { User } from "./user.model";

const credentialRegister = async (payload: Partial<IUser>) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    const error = CustomError.conflict({
      message: "Email already in use",
      errors: ["A user with this email already exists."],
      hints: "Please check the email and try again.",
    });
    throw error;
  }
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

const getAllUsers = async (req: Request) => {
  const users = new QueryBuilder<IUser>(User.find(), req.query)
    .filter()
    .search(["name", "email"])
    .sort()
    .fields()
    .paginate();
  const [userData, metadata] = await Promise.all([
    users.build().select("-password").lean(),
    users.getMetadata(),
  ]);

  return { userData, metadata };
};

const getUserById = async (userId: string) => {
  const user = await User.findById(userId)
    .select("-password -auths -_id")
    .lean();
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

const updateUser = async (userId: string, payload: Partial<IUser>) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: payload },
    { new: true }
  );

  if (!updatedUser) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }

  return {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    picture: updatedUser.picture,
    phone: updatedUser.phone,
    role: updatedUser.role,
    isBlocked: updatedUser.isBlocked,
    isVerified: updatedUser.isVerified,
  };
};
const addSosContact = async (userId: string, payload: Partial<IContact>) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        sosContacts: payload,
      },
    },
    { new: true }
  );

  if (!updatedUser) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }

  return {
    emergencyContacts: updatedUser.sosContacts,
  };
};

const updateSosContact = async (userId: string, contactId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }

  const sosContacts =
    user.sosContacts &&
    user.sosContacts.map((contact) => {
      if (contact._id && contact._id.toString() === contactId) {
        return {
          ...contact,
          isPrimary: !contact.isPrimary,
        };
      }
      return {
        ...contact,
        isPrimary: false,
      };
    });
  if (!sosContacts) {
    throw CustomError.notFound({
      message: "Contact not found",
      errors: ["The contact with the provided ID does not exist."],
      hints: "Please check the contact ID and try again.",
    });
  }

  user.sosContacts = sosContacts;
  const updatedUser = await user.save();

  if (!updatedUser) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }

  return {
    emergencyContacts: updatedUser.sosContacts,
  };
};
const deleteSosContact = async (userId: string, contactId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $pull: { sosContacts: { _id: contactId } },
    },
    { new: true }
  );

  if (!updatedUser) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }

  return {
    emergencyContacts: updatedUser.sosContacts,
  };
};

const verifyRequestUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }
  if (user.isVerified) {
    const error = CustomError.badRequest({
      message: "User already verified",
      errors: ["The user is already verified."],
      hints: "No further action is needed.",
    });
    throw error;
  }
  const verificationCode = crypto.randomInt(10 ** 5, 10 ** 6).toString();

  const redisKey = `${user?.role}[${user?._id}]:${user?.email}`;

  await redisClient.set(redisKey, verificationCode, {
    expiration: {
      type: "EX",
      value: 2 * 60, // 2 minutes
    },
  });

  const emailBody = {
    to: `${user?.email}`,
    subject: "Verify your email",
    text: `Your verification code is ${verificationCode}. It will expire in 2 minutes.`,
    html: `<p>Your verification code is <strong>${verificationCode}</strong>. It will expire in 2 minutes.</p>`,
  };

  await sendMail(emailBody);

  return {
    email: user.email,
    verificationCode,
  };
};

const verifyUser = async (
  userId: string,
  payload: { verificationCode: string }
) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }

  const redisKey = `${user?.role}[${user?._id}]:${user?.email}`;
  const redisVerificationCode = await redisClient.get(redisKey);

  if (!redisVerificationCode) {
    const error = CustomError.badRequest({
      message: "Verification code expired",
      errors: ["The verification code has expired."],
      hints: "Please request a new verification code.",
    });
    throw error;
  }

  if (redisVerificationCode !== payload.verificationCode) {
    const error = CustomError.badRequest({
      message: "Invalid verification code",
      errors: ["The provided verification code is incorrect."],
      hints: "Please check the code and try again.",
    });
    throw error;
  }

  const [verifiedUser] = await Promise.all([
    User.findByIdAndUpdate(userId, { isVerified: true }, { new: true }),
    redisClient.del([redisKey]),
  ]);

  return {
    verificationStatus: verifiedUser?.isVerified,
  };
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
  return {
    isBlocked: user.isBlocked,
  };
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
  return {
    isBlocked: user.isBlocked,
  };
};

const deleteUser = async (userId: string) => {
  const deletedUser = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true }
  );
  if (!deletedUser) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }
  return {
    isDeleted: deletedUser.isDeleted,
  };
};

export const userService = {
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
