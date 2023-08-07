import { Transform, Type } from "class-transformer";
import { IsBoolean, IsOptional, IsPositive } from "class-validator";
import { PaginationQueryDto } from "src/database/dto/pagination.dto";
import { PaginationOptions } from "src/database/services/pagination/pagination.service";

export class GetMoviesQueryDto extends PaginationQueryDto {
  @IsOptional()
  genre: string;

  @IsOptional()
  country: string;

  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  year: Number;

  @IsBoolean()
  @Transform(({ value }) => {
    switch (value) {
      case "true":
        return true;
      case "false":
        return false;
      default:
        return value;
    }
  })
  @IsOptional()
  upcoming = false;

  toPaginationOptions() {
    const options: PaginationOptions = {
      filter: { isUpcoming: this.upcoming },
      ...super.toPaginationOptions(),
    };
    if (this.genre) options.filter!.genres = { $all: [this.genre] };
    if (this.country) options.filter!.countries = { $all: [this.country] };
    if (this.year)
      options.filter!.releaseDate = {
        $gte: new Date(`${this.year}-01-01`),
        $lte: new Date(`${this.year}-12-31`),
      };
    options.sort = this.sort || { releaseDate: -1 };
    return options;
  }
}
