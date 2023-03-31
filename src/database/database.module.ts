import { Module } from "@nestjs/common";
import { PaginationService } from "./services/pagination/pagination.service";

@Module({
  providers: [PaginationService],
})
export class DatabaseModule {}
