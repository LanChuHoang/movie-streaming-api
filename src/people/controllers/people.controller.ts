import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  PaginationQueryDto,
  SearchQueryDto,
} from "src/database/dto/pagination.dto";
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
  getPeople(@Query() query: PaginationQueryDto) {
    return this.peopleService.findAll(query);
  }

  @Get("/search")
  searchPeople(@Query() query: SearchQueryDto) {
    return this.peopleService.findAll(query);
  }

  @Get(":id/credits")
  getCredits(@Param("id") id: string) {
    return this.peopleService.getCredits(id);
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
