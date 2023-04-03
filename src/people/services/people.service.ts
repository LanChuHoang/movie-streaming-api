import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreatePersonDto } from "../dto/create-person.dto";
import { UpdatePersonDto } from "../dto/update-person.dto";
import { Person, PersonDocument } from "../schemas/person.schema";

@Injectable()
export class PeopleService {
  constructor(
    @InjectModel(Person.name) private readonly model: Model<PersonDocument>,
  ) {}

  create(createPersonDto: CreatePersonDto) {
    return this.model.create(createPersonDto);
  }

  findAll() {
    return `This action returns all people`;
  }

  findOne(id: string) {
    return this.model.findById(id);
  }

  update(id: string, updatePersonDto: UpdatePersonDto) {
    return this.model.findByIdAndUpdate(id, updatePersonDto, {
      returnDocument: "after",
    });
  }

  remove(id: string) {
    return this.model.findByIdAndDelete(id, {
      returnDocument: "after",
    });
  }
}
