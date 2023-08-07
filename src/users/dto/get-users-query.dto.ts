import { IsEnum } from "class-validator";
import { PaginationQueryDto } from "src/database/dto/pagination.dto";
import { UserPublicField } from "../constants/users.contants";

export class GetUsersQueryDto extends PaginationQueryDto {
  @IsEnum(UserPublicField, { each: true })
  fields: UserPublicField[];
}
