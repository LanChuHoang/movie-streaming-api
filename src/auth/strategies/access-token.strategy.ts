import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthConfig, authConfigPath } from "../config/auth.config";
import { AccessTokenPayload } from "../types/token.types";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "ac-jwt") {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<AuthConfig>(authConfigPath)?.token.accessTokenSecret,
    });
  }

  async validate(payload: AccessTokenPayload) {
    return { userId: payload.sub, username: payload.username };
  }
}
