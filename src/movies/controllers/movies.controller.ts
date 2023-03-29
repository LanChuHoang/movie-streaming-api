import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { SearchQueryDto } from "src/database/dto/pagination.dto";
import { CreateMovieDto } from "../dto/create-movie.dto";
import { GetMoviesQueryDto } from "../dto/get-movies-query.dto";
import { MoviesService } from "../services/movies.service";

@Controller("movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async createMovie(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get("")
  async getMovies(@Query() query: GetMoviesQueryDto) {
    return this.moviesService.findAll(query);
  }

  @Get("search")
  async searchMovies(@Query() query: SearchQueryDto) {
    return this.moviesService.findAll(query);
  }

  @Get(":id/similar")
  async getSimilarMovies(@Param("id") id: string) {
    return this.moviesService.findSimilar(id);
  }

  @Get("random")
  async getRandomMovies(
    @Query("limit", new DefaultValuePipe(1), ParseIntPipe) limit: number,
  ) {
    return this.moviesService.getRandom(limit);
  }

  @Get(":id/credits")
  async getCredits(@Param("id") id: string) {
    return this.moviesService.getCredits(id);
  }

  @Get(":id")
  async getMovie(@Param("id") id: string) {
    const movie = await this.moviesService.findOne(id);
    if (!movie) throw new NotFoundException();
    return movie;
  }

  @Patch(":id")
  async updateMovie(@Param("id") id: string, @Body() updateMovieDto: any) {
    const movie = await this.moviesService.updateOne(id, updateMovieDto);
    if (!movie) throw new NotFoundException();
    return movie;
  }

  @Delete(":id")
  async deleleMovie(@Param("id") id: string) {
    const movie = await this.moviesService.deleteOne(id);
    if (!movie) throw new NotFoundException();
    return movie;
  }
}
