import { Module } from "@nestjs/common";
import { ShowsController } from "./controllers/shows.controller";
import { ShowsService } from "./services/shows.service";

@Module({
  controllers: [ShowsController],
  providers: [ShowsService],
})
export class ShowsModule {}
