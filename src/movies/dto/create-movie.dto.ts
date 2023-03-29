import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsPositive,
} from "class-validator";
import { CreateMediaDto } from "src/database/dto/create-media.dto";

export class CreateMovieDto extends CreateMediaDto {
  @IsPositive()
  @IsOptional()
  runtime: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  releaseDate: Date;

  @IsArray()
  @IsOptional()
  genres: string[];

  @IsBoolean()
  @IsOptional()
  isUpcoming = false;
}
