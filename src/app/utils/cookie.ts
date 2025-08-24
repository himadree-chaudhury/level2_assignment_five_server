import { CookieOptions, Response } from "express";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

export const setCookie = (
  res: Response,
  tokenInfo: { accessToken: string; refreshToken: string }
) => {
  if (tokenInfo.accessToken) {
    res.cookie(
      "accessToken",
      tokenInfo.accessToken,
      cookieOptions as CookieOptions
    );
  }
  if (tokenInfo.refreshToken) {
    res.cookie(
      "refreshToken",
      tokenInfo.refreshToken,
      cookieOptions as CookieOptions
    );
  }
};

export const clearCookies = (res: Response) => {
  res.clearCookie("accessToken", cookieOptions as CookieOptions);
  res.clearCookie("refreshToken", cookieOptions as CookieOptions);
};
