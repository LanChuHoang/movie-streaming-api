import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { AuthConfig, authConfigPath } from "../config/auth.config";
import { ExtractedUser, RefreshTokenPayload } from "../types/token.types";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "rf-jwt") {
  private static extractJWT(req: Request) {
    return req.cookies["refresh_token"];
  }

  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: RefreshTokenStrategy.extractJWT,
      ignoreExpiration: false,
      secretOrKey:
        configService.get<AuthConfig>(authConfigPath)!.token.refreshTokenSecret,
    });
  }

  async validate(payload: RefreshTokenPayload): Promise<ExtractedUser> {
    return { id: payload.sub, username: payload.username };
  }
}
