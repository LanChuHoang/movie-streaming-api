import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthConfig, authConfigPath } from "src/auth/config/auth.config";
import { TokenPayload } from "src/auth/types/token.types";

@Injectable()
export class TokenService {
  private readonly config: AuthConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.config = this.configService.get<AuthConfig>(authConfigPath)!;
  }

  generateAccessToken(payload: TokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.config.token.accessTokenSecret,
      expiresIn: this.config.token.accessTokenExpirationTime,
    });
  }

  generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.config.token.refreshTokenSecret,
      expiresIn: this.config.token.refreshTokenExpirationTime,
    });
  }

  async generateTokens(payload: TokenPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);
    return { accessToken, refreshToken };
  }
}
