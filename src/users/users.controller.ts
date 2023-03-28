import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { AccessTokenAuthGuard } from "src/auth/guards/access-token-auth.guard";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenAuthGuard)
  @Get(":id")
  async getUser(@Param("id", ParseIntPipe) userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }
}
