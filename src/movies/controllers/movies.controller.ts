import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { MediaController } from "src/media/controllers/media.controller";
import { CreateMovieDto } from "../dto/create-movie.dto";
import { GetMoviesQueryDto } from "../dto/get-movies-query.dto";
import { UpdateMovieDto } from "../dto/update-movie.dto";
import { MovieDocument } from "../schemas/movie.schema";
import { MoviesService } from "../services/movies.service";

@Controller("movies")
export class MoviesController extends MediaController<MovieDocument> {
  constructor(moviesServices: MoviesService) {
    super(moviesServices);
  }

  @Post()
  createMedia(@Body() createMediaDto: CreateMovieDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Get("")
  getManyMedia(@Query() query: GetMoviesQueryDto) {
    return this.mediaService.findAll(query);
  }

  @Patch(":id")
  async updateMedia(
    @Param("id") id: string,
    @Body() updateMediaDto: UpdateMovieDto,
  ) {
    const media = await this.mediaService.updateOne(id, updateMediaDto);
    if (!media) throw new NotFoundException();
    return media;
  }
}
