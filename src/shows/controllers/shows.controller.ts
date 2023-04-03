import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { MediaController } from "src/media/controllers/media.controller";
import { CreateShowDto } from "../dto/create-show.dto";
import { GetShowsQueryDto } from "../dto/get-shows-query.dto";
import { UpdateShowDto } from "../dto/update-show.dto";
import { ShowDocument } from "../schemas/show.schema";
import { ShowsService } from "../services/shows.service";

@Controller("shows")
export class ShowsController extends MediaController<ShowDocument> {
  constructor(private readonly showsService: ShowsService) {
    super(showsService);
  }

  @Post()
  createMedia(@Body() createMediaDto: CreateShowDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Get("")
  getManyMedia(@Query() query: GetShowsQueryDto) {
    return this.mediaService.findAll(query);
  }

  @Patch(":id")
  async updateMedia(
    @Param("id") id: string,
    @Body() updateMediaDto: UpdateShowDto,
  ) {
    const media = await this.mediaService.updateOne(id, updateMediaDto);
    if (!media) throw new NotFoundException();
    return media;
  }

  @Get("/:id/seasons")
  async getSeasons(@Param("id") id: string) {
    const seasons = await this.showsService.getSeasons(id);
    if (!seasons) throw new NotFoundException();
    return seasons;
  }

  @Get("/:id/season/:seasonNumber")
  async getSeason(
    @Param("id") id: string,
    @Param("seasonNumber", ParseIntPipe) seasonNumber: number,
  ) {
    const season = await this.showsService.getSeason(id, seasonNumber);
    if (!season) throw new NotFoundException();
    return season;
  }

  @Get("/:id/season/:seasonNumber/episode/:episodeNumber")
  async getEpisode(
    @Param("id") id: string,
    @Param("seasonNumber", ParseIntPipe) seasonNumber: number,
    @Param("episodeNumber", ParseIntPipe) episodeNumber: number,
  ) {
    const episode = await this.showsService.getEpisode(
      id,
      seasonNumber,
      episodeNumber,
    );
    if (!episode) throw new NotFoundException();
    return episode;
  }
}
