import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "src/auth/dto/create-user.dto";
import { BasePaginationDto } from "src/database/dto/pagination.dto";
import { PaginationService } from "src/database/services/pagination/pagination.service";
import { User, UserDocument } from "../schemas/user.schema";

@Injectable()
export class UsersService extends PaginationService<UserDocument> {
  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super(model);
  }

  exists(username: string, email: string) {
    return this.model.exists({
      $or: [{ username: username }, { email: email }],
    });
  }

  createUser(createUserDto: CreateUserDto) {
    return this.model.create(createUserDto);
  }

  getUserById(id: string) {
    return this.model.findById(id);
  }

  getUserByEmail(email: string) {
    return this.model.findOne({ email });
  }

  getUsers(query: BasePaginationDto) {
    return this.pagination(query.toPaginationOptions());
  }

  updateUser(id: string, updateUserDto: any) {
    return this.model.findByIdAndUpdate(id, updateUserDto, {
      returnDocument: "after",
    });
  }

  remove(id: string) {
    return this.model.findByIdAndDelete(id, { returnDocument: "after" });
  }

  async getRefreshToken(userId: string) {
    return (await this.model.findById(userId, { refreshToken: 1 }))
      ?.refreshToken;
  }
}
