import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreatePersonDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dob?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dod?: Date;

  @IsString()
  @IsOptional()
  pob?: string;

  @IsString()
  @IsOptional()
  job?: string;

  @IsString()
  @IsOptional()
  biography?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  imdbID?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  tmdbID?: number;
}
