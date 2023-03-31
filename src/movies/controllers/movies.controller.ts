import { Controller } from "@nestjs/common";
import { SearchQueryDto } from "src/database/dto/pagination.dto";
import { MediaController } from "src/media/controllers/media.controller";
import { CreateMovieDto } from "../dto/create-movie.dto";
import { GetMoviesQueryDto } from "../dto/get-movies-query.dto";
import { UpdateMovieDto } from "../dto/update-movie.dto";
import { MovieDocument } from "../schemas/movie.schema";
import { MoviesService } from "../services/movies.service";

@Controller("movies")
export class MoviesController extends MediaController<
  MovieDocument,
  CreateMovieDto,
  UpdateMovieDto,
  GetMoviesQueryDto,
  SearchQueryDto
> {
  constructor(moviesServices: MoviesService) {
    super(moviesServices);
  }
}
