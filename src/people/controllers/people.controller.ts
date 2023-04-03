import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreatePersonDto } from "../dto/create-person.dto";
import { UpdatePersonDto } from "../dto/update-person.dto";
import { PeopleService } from "../services/people.service";

@Controller("people")
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.peopleService.create(createPersonDto);
  }

  @Get()
  findAll() {
    return this.peopleService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const person = await this.peopleService.findOne(id);
    if (!person) throw new NotFoundException();
    return person;
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    const person = await this.peopleService.update(id, updatePersonDto);
    if (!person) throw new NotFoundException();
    return person;
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const person = await this.peopleService.remove(id);
    if (!person) throw new NotFoundException();
    return person;
  }
}
