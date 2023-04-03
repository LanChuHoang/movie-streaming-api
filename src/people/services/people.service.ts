import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BasePaginationDto } from "src/database/dto/pagination.dto";
import { PaginationService } from "src/database/services/pagination/pagination.service";
import { MoviesService } from "src/movies/services/movies.service";
import { ShowsService } from "src/shows/services/shows.service";
import { CreatePersonDto } from "../dto/create-person.dto";
import { UpdatePersonDto } from "../dto/update-person.dto";
import { Person, PersonDocument } from "../schemas/person.schema";

@Injectable()
export class PeopleService extends PaginationService<PersonDocument> {
  constructor(
    @InjectModel(Person.name) model: Model<PersonDocument>,
    private readonly moviesService: MoviesService,
    private readonly showsService: ShowsService,
  ) {
    super(model);
  }

  create(createPersonDto: CreatePersonDto) {
    return this.model.create(createPersonDto);
  }

  findAll(basePaginationDto: BasePaginationDto) {
    const options = basePaginationDto.toPaginationOptions();
    return this.pagination(options);
  }

  async getCredits(id: string) {
    const [movieCredits, showCredits] = await Promise.all([
      this.moviesService.getJoinedMovies(id),
      this.showsService.getJoinedShows(id),
    ]);
    const response = {
      _id: id,
      movie: movieCredits,
      show: showCredits,
    };
    return response;
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
