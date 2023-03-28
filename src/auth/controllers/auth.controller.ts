import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { AuthConfig, authConfigPath } from "../config/auth.config";
import { CreateUserDto } from "../dto/create-user.dto";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { RefreshTokenAuthGuard } from "../guards/refresh-token-auth.guard";
import { CheckDuplicateUserValidator } from "../pipes/check-duplicate-user.pipe";
import { AuthService } from "../services/auth/auth.service";
import { ExtractedUser } from "../types/token.types";

@Controller("auth")
export class AuthController {
  private readonly config: AuthConfig;
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.config = this.configService.get<AuthConfig>(authConfigPath)!;
  }

  @UsePipes(CheckDuplicateUserValidator)
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
    const { username, id } = req.user as ExtractedUser;
    const { accessToken, refreshToken, user } = await this.authService.login(
      id,
      username,
    );
    res.cookie("refresh_token", refreshToken, this.config.cookie.refreshToken);
    return { accessToken, ...user?.toObject() };
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get("refresh_token")
  async refresh(@Req() req: Request) {
    const { username, id } = req.user as ExtractedUser;
    return this.authService.refreshToken(username, id);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get("logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { id } = req.user as ExtractedUser;
    await this.authService.logout(id);
    res.clearCookie("refresh_token", this.config.cookie.refreshToken);
    return { message: "User has been logged out" };
  }
}
