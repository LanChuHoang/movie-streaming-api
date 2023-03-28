import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { RefreshTokenPayload } from "../types/token.types";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "rf-jwt") {
  private static extractJWT(req: Request) {
    return req.cookies["refresh_token"];
  }

  constructor() {
    super({
      jwtFromRequest: RefreshTokenStrategy.extractJWT,
      ignoreExpiration: false,
      secretOrKey: "secret2",
    });
  }

  async validate(payload: RefreshTokenPayload) {
    return { userId: payload.sub, username: payload.username };
  }
}
