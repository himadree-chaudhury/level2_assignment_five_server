import { CustomError } from "../../../utils/error";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/jwt";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialLogin = (payload: Partial<IUser>) => {
  const jwtUserPayload = {
    userId: payload._id,
    email: payload.email,
    role: payload.role,
  };

  const accessToken = generateAccessToken(jwtUserPayload);
  const refreshToken = generateRefreshToken(jwtUserPayload);

  return {
    accessToken,
    refreshToken,
  };
};

const getNewAccessToken = async (token: string) => {
  const isTokenValid = verifyRefreshToken(token);
  if (!isTokenValid) {
    const error = CustomError.unauthorized({
      message: "Invalid or expired refresh token.",
      errors: ["The provided refresh token is not valid."],
      hints: "Please login again to obtain a new access token.",
    });
    throw error;
  }

  const user = await User.findById(isTokenValid.userId);
  if (!user) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user associated with the token does not exist."],
      hints: "Please check your credentials and try again.",
    });
    throw error;
  }
  if (user.isBlocked || user.isDeleted) {
    const error = CustomError.forbidden({
      message: "Access denied",
      errors: ["Your account is blocked or deleted."],
      hints: "Please contact support for further assistance.",
    });
    throw error;
  }
  const jwtUserPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
  const newAccessToken = generateAccessToken(jwtUserPayload);
  const newRefreshToken = generateRefreshToken(jwtUserPayload);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const AuthService = {
  credentialLogin,
  getNewAccessToken,
};
