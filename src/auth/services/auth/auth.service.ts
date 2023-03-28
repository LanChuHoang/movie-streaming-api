import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async authenticateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(createUserDTO: CreateUserDto) {
    const hash = '';
    const createdUser = { id: 1 };
    const payload = { username: createUserDTO.username, sub: createdUser.id };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const response = { access_token: accessToken };
    return response;
  }

  async refreshToken(user: any) {
    const payload = { username: user.username, sub: user.userId };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const response = { access_token: accessToken };
    return response;
  }
}
