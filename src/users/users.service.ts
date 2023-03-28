import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "src/auth/dto/create-user.dto";
import { User, UserDocument } from "./schemas/user.schema";

export interface IUser {
  userId: number;
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  private readonly users: IUser[] = [
    {
      userId: 1,
      username: "username1",
      email: "email@email.com",
      password: "password",
    },
    {
      userId: 2,
      username: "username2",
      email: "email@email.com",
      password: "password",
    },
  ];

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(username: string) {
    return this.users.find((u) => u.username === username);
  }

  async findByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }

  async findById(id: number) {
    return this.users.find((u) => u.userId === id);
  }

  async createUser(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
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
