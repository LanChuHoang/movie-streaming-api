import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "src/auth/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import { TokenService } from "../token/token.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async authenticateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user?.password);
    if (!isValid) return null;
    return user;
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    const payload = { username: createdUser.username, sub: createdUser.id };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);
    await this.usersService.updateUser(createdUser.id, { refreshToken });
    return { accessToken, refreshToken, user: createdUser };
  }

  async login(id: string, username: string) {
    const payload = { username: username, sub: id };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);
    const user = await this.usersService.updateUser(id, { refreshToken });
    return { accessToken, refreshToken, user };
  }

  async refreshToken(id: string, username: string) {
    const payload = { username: username, sub: id };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const response = { access_token: accessToken };
    return response;
  }

  async logout(id: string) {
    this.usersService.updateUser(id, { refreshToken: "" });
  }
}
