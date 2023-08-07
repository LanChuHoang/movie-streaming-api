import { CookieOptions } from "express";

export const authConfigPath = "auth";

export interface AuthConfig {
  token: {
    accessTokenSecret: string;
    accessTokenExpirationTime: number;
    refreshTokenSecret: string;
    refreshTokenExpirationTime: number;
  };
  cookie: {
    refreshToken: CookieOptions;
  };
}

export default () => ({
  [authConfigPath]: {
    token: {
      accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
      accessTokenExpirationTime:
        parseInt(process.env.ACCESS_TOKEN_EXPIRATION_TIME || "") || 900, // 15 mins
      refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
      refreshTokenExpirationTime:
        parseInt(process.env.REFRESH_TOKEN_EXPIRATION_TIME || "") || 604800, // 7 days}
    },
    cookie: {
      refreshToken: {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge:
          (parseInt(process.env.REFRESH_TOKEN_EXPIRATION_TIME || "") ||
            604800) * 1000,
      },
    },
  },
});
