import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Person } from "./entities/person.entity";
import { PeopleController } from "./people.controller";
import { PeopleService } from "./people.service";
import { PersonSchema } from "./schemas/person.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
