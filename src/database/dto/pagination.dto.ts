import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsPositive } from "class-validator";
import { Expression } from "mongoose";
import { PaginationOptions } from "../services/pagination/pagination.service";

export class BasePaginationDto {
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  page = 1;

  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  limit = 30;

  @Transform(({ value }) => (value as string).split(","))
  @IsOptional()
  fields: string[];

  toPaginationOptions() {
    const options: PaginationOptions = { page: this.page, limit: this.limit };
    if (this.fields)
      options.projection = this.fields.reduce(
        (prevResult, f) => ({ ...prevResult, [f]: 1 }),
        {},
      );
    return options;
  }
}

export class PaginationQueryDto extends BasePaginationDto {
  @Transform(({ value }) => {
    const [field, order] = value.split(":");
    const parsedOrder = order === "desc" ? -1 : 1;
    return { [field]: parsedOrder };
  })
  @IsOptional()
  sort: Record<string, 1 | -1 | Expression.Meta>;

  toPaginationOptions(): PaginationOptions {
    const options = super.toPaginationOptions();
    if (this.sort) options.sort = this.sort;
    return options;
  }
}

export class SearchQueryDto extends BasePaginationDto {
  @Transform(({ value }) => (value as string).trim())
  @IsNotEmpty()
  query: string;

  toPaginationOptions(): PaginationOptions {
    return {
      filter: { $text: { $search: this.query } },
      ...super.toPaginationOptions(),
    };
  }
}
