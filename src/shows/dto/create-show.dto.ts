import { plainToClass, Transform, Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from "class-validator";
import { CreateMediaDto } from "src/media/dto/create-media.dto";

class CreateEpisodeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @Min(0)
  @IsNumber()
  episodeNumber: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  airDate?: Date;

  @IsNumber()
  @IsOptional()
  runtime?: number;

  @IsString()
  @IsOptional()
  overview?: string;

  @IsUrl()
  @IsOptional()
  thumbnailUrl?: string;

  @IsUrl()
  @IsOptional()
  videoUrl?: string;
}

class CreateSeasonDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @Min(0)
  @IsNumber()
  seasonNumber: number;

  @IsString()
  @IsOptional()
  overview?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  releaseDate?: Date;

  @IsString()
  @IsOptional()
  posterUrl?: string;

  @IsUrl()
  @IsOptional()
  backdropUrl?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Transform(({ value }) => {
    if (value instanceof Array) {
      return value.map((v) =>
        v.constructor.name === "Object"
          ? plainToClass(CreateEpisodeDto, v)
          : plainToClass(CreateEpisodeDto, {}),
      );
    }
    return value;
  })
  @IsOptional()
  episodes?: CreateEpisodeDto[];
}

export class CreateShowDto extends CreateMediaDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  firstAirDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  lastAirDate?: Date;

  @IsArray()
  @IsOptional()
  genres?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Transform(({ value }) => {
    if (value instanceof Array) {
      return value.map((v) =>
        v.constructor.name === "Object"
          ? plainToClass(CreateSeasonDto, v)
          : plainToClass(CreateSeasonDto, {}),
      );
    }
    return value;
  })
  @IsOptional()
  seasons?: CreateSeasonDto[];
}
