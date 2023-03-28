import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthConfig, authConfigPath } from '../config/auth.config';
import { CreateUserDto } from '../dto/create-user.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RefreshTokenAuthGuard } from '../guards/refresh-token-auth.guard';
import { AuthService } from '../services/auth/auth.service';

@Controller('auth')
export class AuthController {
  private readonly config: AuthConfig;
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.config = this.configService.get<AuthConfig>(authConfigPath)!;
  }

  @Post('register')
  async register(
    @Body() createUserDTO: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(
      createUserDTO,
    );
    res.cookie('refresh_token', refreshToken, this.config?.cookie.refreshToken);
    return { accese_token: accessToken };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get('refresh_token')
  async refresh(@Req() req: Request) {
    return this.authService.refreshToken(req.user);
  }

  async logout() {}
}
