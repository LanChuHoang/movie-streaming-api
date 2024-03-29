import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { AuthConfig, authConfigPath } from "../config/auth.config";
import { CreateUserDto } from "../dto/create-user.dto";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { RefreshTokenAuthGuard } from "../guards/refresh-token-auth.guard";
import { AuthService } from "../services/auth/auth.service";
import { TokenPayload } from "../types/token.types";

@Controller("auth")
export class AuthController {
  private readonly config: AuthConfig;
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.config = this.configService.get<AuthConfig>(authConfigPath)!;
  }

  @Post("register")
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.register(
      createUserDto,
    );
    res.cookie("refresh_token", refreshToken, this.config.cookie.refreshToken);
    return { accessToken, ...user.toObject() };
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post("login")
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      req.user as TokenPayload,
    );
    res.cookie("refresh_token", refreshToken, this.config.cookie.refreshToken);
    return { accessToken, ...user?.toObject() };
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get("refresh_token")
  async refresh(@Req() req: Request) {
    return this.authService.refreshToken(req.user as TokenPayload);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get("logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { sub: id } = req.user as TokenPayload;
    await this.authService.logout(id);
    res.clearCookie("refresh_token", this.config.cookie.refreshToken);
    return { message: "User has been logged out" };
  }
}
