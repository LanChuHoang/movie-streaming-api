import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { AccessTokenAuthGuard } from "src/auth/guards/access-token-auth.guard";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenAuthGuard)
  @Get(":id")
  async getUser(@Param("id") id: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }
}
