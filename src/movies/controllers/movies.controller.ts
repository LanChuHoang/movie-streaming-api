import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AccessTokenAuthGuard } from "src/auth/guards/access-token-auth.guard";
import { AdminGuard } from "src/auth/guards/admin.guard";
import { MediaController } from "src/media/controllers/media.controller";
import { CreateMovieDto } from "../dto/create-movie.dto";
import { GetMoviesQueryDto } from "../dto/get-movies-query.dto";
import { UpdateMovieDto } from "../dto/update-movie.dto";
import { MovieDocument } from "../schemas/movie.schema";
import { MoviesService } from "../services/movies.service";

@UseGuards(AccessTokenAuthGuard)
@Controller("movies")
export class MoviesController extends MediaController<MovieDocument> {
  constructor(moviesServices: MoviesService) {
    super(moviesServices);
  }

  @UseGuards(AdminGuard)
  @Post()
  createMedia(@Body() createMediaDto: CreateMovieDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Get("")
  getManyMedia(@Query() query: GetMoviesQueryDto) {
    return this.mediaService.findAll(query);
  }

  @UseGuards(AdminGuard)
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
