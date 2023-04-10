import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../services/auth/auth.service";
import { TokenPayload } from "../types/token.types";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email",
      passwordField: "password",
      session: false,
    });
  }

  async validate(username: string, password: string): Promise<TokenPayload> {
    const user = await this.authService.authenticateUser(username, password);
    if (!user) throw new UnauthorizedException();
    return { username: user.username, sub: user.id, isAdmin: user.isAdmin };
  }
}
