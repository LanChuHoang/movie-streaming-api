import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthConfig, authConfigPath } from "../config/auth.config";
import { FullTokenPayload } from "../types/token.types";

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

  validate({ iat, exp, ...payload }: FullTokenPayload) {
    return payload;
  }
}
