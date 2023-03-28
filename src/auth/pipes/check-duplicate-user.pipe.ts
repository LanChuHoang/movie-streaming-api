import {
  ArgumentMetadata,
  ConflictException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable()
export class CheckDuplicateUserValidator implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (await this.usersService.exists(value.username, value.email))
      throw new ConflictException("User already exists");
    return value;
  }
}
