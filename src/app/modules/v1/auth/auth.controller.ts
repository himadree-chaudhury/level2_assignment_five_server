import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import passport from "passport";
import { asyncTryCatch } from "../../../utils/asyncTryCatch";
import { clearCookies, setCookie } from "../../../utils/cookie";
import { CustomError } from "../../../utils/error";
import { genericResponse } from "../../../utils/genericResponse";
import { AuthService } from "./auth.service";

const credentialLogin = asyncTryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        const error = CustomError.internalServerError({
          message: "Server error during authentication",
          errors: [err.message],
          hints: "Please try again later.",
        });
        return next(error);
      }
      if (!user) {
        const error = CustomError.notFound({
          message: "User not found",
          errors: [info.message],
          hints: "Please check your credentials and try again.",
        });
        return next(error);
      }

      const userTokens = AuthService.credentialLogin(user);

      setCookie(res, {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
      });

      genericResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
          },
          tokens: userTokens,
        },
      });
    })(req, res, next);
  }
);

const getNewAccessToken = asyncTryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken =
      req.headers.authorization?.split(" ")[1] || req.cookies.refreshToken;
    if (!refreshToken) {
      const error = CustomError.badRequest({
        message: "Refresh token is missing",
        errors: ["Refresh token is required to obtain a new access token."],
        hints:
          "Please provide a valid refresh token in the Authorization header or as a cookie.",
      });
      return next(error);
    }

    const userTokens = await AuthService.getNewAccessToken(refreshToken);
    setCookie(res, {
      accessToken: userTokens.accessToken,
      refreshToken: userTokens.refreshToken,
    });
    genericResponse(res, {
      success: true,
      status: httpStatus.OK,
      message: "New access token generated successfully",
      data: {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
      },
    });
  }
);

const logout = asyncTryCatch(async (req: Request, res: Response) => {
  clearCookies(res);
  genericResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Logout successful",
    data: null,
  });
});

export const AuthController = {
  credentialLogin,
  getNewAccessToken,
  logout,
};
