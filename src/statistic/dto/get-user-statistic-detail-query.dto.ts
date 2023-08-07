import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";

export class GetUserStatisticDetailQueryDto {
  @IsDate()
  @Type(() => Date)
  from: Date;

  @IsDate()
  @Type(() => Date)
  to: Date;

  @IsNotEmpty()
  type: string;
}
