import { IsEnum } from "class-validator";
import { SearchQueryDto } from "src/database/dto/pagination.dto";
import { UserPublicField } from "../constants/users.contants";

export class SearchUsersQueryDto extends SearchQueryDto {
  @IsEnum(UserPublicField, { each: true })
  fields: UserPublicField[];
}
