import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MoviesModule } from "src/movies/movies.module";
import { ShowsModule } from "src/shows/shows.module";
import { PeopleController } from "./controllers/people.controller";
import { Person, PersonSchema } from "./schemas/person.schema";
import { PeopleService } from "./services/people.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
    MoviesModule,
    ShowsModule,
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
