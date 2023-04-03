import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";
import { PaginationQueryDto } from "src/database/dto/pagination.dto";
import { PaginationOptions } from "src/database/services/pagination/pagination.service";

export class GetShowsQueryDto extends PaginationQueryDto {
  @IsOptional()
  genre: string;

  @IsOptional()
  country: string;

  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  year: Number;

  toPaginationOptions() {
    const options: PaginationOptions = super.toPaginationOptions();
    const filter: any = {};
    if (this.genre) filter.genres = { $all: [this.genre] };
    if (this.country) filter.countries = { $all: [this.country] };
    if (this.year)
      filter.lastAirDate = {
        $gte: new Date(`${this.year}-01-01`),
        $lte: new Date(`${this.year}-12-31`),
      };
    if (filter.genre || filter.country || filter.year) options.filter = filter;
    options.sort = this.sort || { lastAirDate: -1 };
    return options;
  }
}
