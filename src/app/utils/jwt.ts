import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import envVariables from "../config/env";
import { CustomError } from "./error";

export const generateAccessToken = (payload: JwtPayload) => {
  const token = jwt.sign(payload, envVariables.JWT_ACCESS_SECRET, {
    expiresIn: envVariables.JWT_ACCESS_TOKEN_EXPIRATION,
  } as SignOptions);
  return token;
};
export const generateRefreshToken = (payload: JwtPayload) => {
  const token = jwt.sign(payload, envVariables.JWT_REFRESH_SECRET, {
    expiresIn: envVariables.JWT_REFRESH_TOKEN_EXPIRATION,
  } as SignOptions);
  return token;
};

export const verifyAccessToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, envVariables.JWT_ACCESS_SECRET) as JwtPayload;
    return decoded;
  } catch (err: any) {
    const error = CustomError.unauthorized({
      message: "Invalid or expired token.",
      errors: [err.message],
      hints: "Please login again to obtain a new access token.",
    });
    throw error;
  }
};
export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, envVariables.JWT_REFRESH_SECRET) as JwtPayload;
    return decoded;
  } catch (err: any) {
    const error = CustomError.unauthorized({
      message: "Invalid or expired token.",
      errors: [err.message],
      hints: "Please login again to obtain a new refresh token.",
    });
    throw error;
  }
};
