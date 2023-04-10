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
  UseGuards,
} from "@nestjs/common";
import { AccessTokenAuthGuard } from "src/auth/guards/access-token-auth.guard";
import { AdminGuard } from "src/auth/guards/admin.guard";
import { MediaController } from "src/media/controllers/media.controller";
import { CreateShowDto } from "../dto/create-show.dto";
import { GetShowsQueryDto } from "../dto/get-shows-query.dto";
import { UpdateShowDto } from "../dto/update-show.dto";
import { ShowDocument } from "../schemas/show.schema";
import { ShowsService } from "../services/shows.service";

@UseGuards(AccessTokenAuthGuard)
@Controller("shows")
export class ShowsController extends MediaController<ShowDocument> {
  constructor(private readonly showsService: ShowsService) {
    super(showsService);
  }

  @UseGuards(AdminGuard)
  @Post()
  createMedia(@Body() createMediaDto: CreateShowDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Get("")
  getManyMedia(@Query() query: GetShowsQueryDto) {
    return this.mediaService.findAll(query);
  }

  @UseGuards(AdminGuard)
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
