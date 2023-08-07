import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { AuthConfig, authConfigPath } from "../config/auth.config";
import { AuthService } from "../services/auth/auth.service";
import { FullTokenPayload, TokenPayload } from "../types/token.types";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "rf-jwt") {
  private static extractJWT(req: Request) {
    return req.cookies["refresh_token"];
  }

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: RefreshTokenStrategy.extractJWT,
      ignoreExpiration: false,
      secretOrKey:
        configService.get<AuthConfig>(authConfigPath)!.token.refreshTokenSecret,
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    { sub, username, isAdmin }: FullTokenPayload,
  ): Promise<TokenPayload | undefined> {
    const refreshToken = request.cookies?.refresh_token;
    const payload: TokenPayload = { sub, username, isAdmin };
    if (await this.authService.refreshTokenMatched(payload.sub, refreshToken))
      return payload;
    return undefined;
  }
}
