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
    res.cookie("refresh_token", refreshToken, this.config?.cookie.refreshToken);
    return { accese_token: accessToken, user };
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post("login")
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get("refresh_token")
  async refresh(@Req() req: Request) {
    return this.authService.refreshToken(req.user);
  }

  @Get("logout")
  async logout() {}
}
