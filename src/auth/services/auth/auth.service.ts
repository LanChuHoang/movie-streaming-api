import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "src/auth/dto/create-user.dto";
import { TokenPayload } from "src/auth/types/token.types";
import { UsersService } from "src/users/services/users.service";
import { TokenService } from "../token/token.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async authenticateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) return undefined;
    const isValid = await bcrypt.compare(password, user?.password);
    if (!isValid) return undefined;
    return user;
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    const payload: TokenPayload = {
      username: createdUser.username,
      sub: createdUser.id,
      isAdmin: createdUser.isAdmin,
    };
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(payload);
    await this.usersService.updateUser(createdUser.id, { refreshToken });
    return { accessToken, refreshToken, user: createdUser };
  }

  async login(payload: TokenPayload) {
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(payload);
    const user = await this.usersService.updateUser(payload.sub, {
      refreshToken,
    });
    return { accessToken, refreshToken, user };
  }

  async refreshToken(payload: TokenPayload) {
    const accessToken = await this.tokenService.generateAccessToken(payload);
    const response = { access_token: accessToken };
    return response;
  }

  async logout(id: string) {
    await this.usersService.updateUser(id, { refreshToken: "" });
  }

  async refreshTokenMatched(id: string, refreshToken: string) {
    return (
      refreshToken &&
      (await this.usersService.getRefreshToken(id)) === refreshToken
    );
  }
}
