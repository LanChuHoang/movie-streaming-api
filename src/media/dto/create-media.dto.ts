import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  tagline: string;

  @IsString()
  @IsOptional()
  overview: string;

  @IsBoolean()
  @IsOptional()
  adult: boolean;

  @IsString()
  @IsOptional()
  imdbID: string;

  @IsNumber()
  @IsOptional()
  tmdbID: number;

  @IsArray()
  @IsOptional()
  countries: string[];

  @IsArray()
  @IsOptional()
  cast: string[];

  @IsArray()
  @IsOptional()
  directors: string[];

  @IsArray()
  @IsOptional()
  trailers: string[];

  @IsUrl()
  @IsOptional()
  posterUrl: string;

  @IsUrl()
  @IsOptional()
  thumbnailUrl: string;

  @IsUrl()
  @IsOptional()
  backdropUrl: string;
}
