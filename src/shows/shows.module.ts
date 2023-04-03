import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ShowsController } from "./controllers/shows.controller";
import { Show, ShowSchema } from "./schemas/show.schema";
import { ShowsService } from "./services/shows.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Show.name, schema: ShowSchema }]),
  ],
  controllers: [ShowsController],
  providers: [ShowsService],
  exports: [ShowsService],
})
export class ShowsModule {}
