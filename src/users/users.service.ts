import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "src/auth/dto/create-user.dto";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async exists(username: string, email: string) {
    return this.userModel.exists({
      $or: [{ username: username }, { email: email }],
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async getUserById(id: string) {
    return this.userModel.findById(id);
  }

  async getUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async getUsers() {
    return this.userModel.find().sort({ createdAt: -1 }).limit(10);
  }

  async updateUser(id: string, updateUserDto: any) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, {
      returnDocument: "after",
    });
  }
}
