import { Module } from "@nestjs/common";
import { MediaService } from "./services/media/media.service";
import { PaginationService } from "./services/pagination/pagination.service";

@Module({
  providers: [MediaService, PaginationService],
})
export class DatabaseModule {}
