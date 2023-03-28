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
import { MoviesService } from "../services/movies.service";

@Controller("movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async createMovie(@Body() createMovieDto: any) {
    const movie = await this.moviesService.createMovie(createMovieDto);
    return movie;
  }

  @Get(":id")
  async getMovie(@Param("id") id: string) {
    const movie = await this.moviesService.getMovieById(id);
    if (!movie) throw new NotFoundException();
    return movie;
  }

  @Patch(":id")
  async updateMovie(@Param("id") id: string, @Body() updateMovieDto: any) {
    const movie = await this.moviesService.updateMovie(id, updateMovieDto);
    if (!movie) throw new NotFoundException();
    return movie;
  }

  @Delete(":id")
  async deleleMovie(@Param("id") id: string) {
    const movie = await this.moviesService.deleteMovie(id);
    if (!movie) throw new NotFoundException();
    return movie;
  }
}
