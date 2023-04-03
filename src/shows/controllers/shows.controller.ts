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
import { CreateShowDto } from "../dto/create-show.dto";
import { GetShowsQueryDto } from "../dto/get-shows-query.dto";
import { UpdateShowDto } from "../dto/update-show.dto";
import { ShowDocument } from "../schemas/show.schema";
import { ShowsService } from "../services/shows.service";

@Controller("shows")
export class ShowsController extends MediaController<ShowDocument> {
  constructor(showsService: ShowsService) {
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
}
