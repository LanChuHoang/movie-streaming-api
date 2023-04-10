import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AccessTokenAuthGuard } from "src/auth/guards/access-token-auth.guard";
import { AdminGuard } from "src/auth/guards/admin.guard";
import { GetUsersQueryDto } from "../dto/get-users-query.dto";
import { SearchUsersQueryDto } from "../dto/search-users-query.dto";
import { UsersService } from "../services/users.service";

@UseGuards(AccessTokenAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AdminGuard)
  @Get()
  async getUsers(@Query() query: GetUsersQueryDto) {
    return this.usersService.getUsers(query);
  }

  @UseGuards(AdminGuard)
  @Get("/search")
  async searchUsers(@Query() query: SearchUsersQueryDto) {
    return this.usersService.getUsers(query);
  }

  @Get(":id")
  async getUser(@Param("id") id: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @UseGuards(AdminGuard)
  @Delete(":id")
  async deleteUser(@Param("id") id: string) {
    const user = await this.usersService.remove(id);
    if (!user) throw new NotFoundException();
    return user;
  }
}
