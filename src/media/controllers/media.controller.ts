import {
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AdminGuard } from "src/auth/guards/admin.guard";
import { SearchQueryDto } from "src/database/dto/pagination.dto";
import { MediaDocument } from "src/media/schemas/media.schema";
import { MediaService } from "../services/media.service";

export class MediaController<MediaType extends MediaDocument> {
  constructor(protected readonly mediaService: MediaService<MediaType>) {}

  @Get("search")
  searchMedia(@Query() query: SearchQueryDto) {
    return this.mediaService.findAll(query);
  }

  @Get(":id/similar")
  getSimilarMedia(@Param("id") id: string) {
    return this.mediaService.findSimilar(id);
  }

  @Get("random")
  getRandomMedia(
    @Query("limit", new DefaultValuePipe(1), ParseIntPipe) limit: number,
  ) {
    return this.mediaService.getRandom(limit);
  }

  @Get(":id/credits")
  getCredits(@Param("id") id: string) {
    return this.mediaService.getCredits(id);
  }

  @Get(":id")
  async getOneMedia(@Param("id") id: string) {
    const media = await this.mediaService.findOne(id);
    if (!media) throw new NotFoundException();
    return media;
  }

  @UseGuards(AdminGuard)
  @Delete(":id")
  async deleleMedia(@Param("id") id: string) {
    const media = await this.mediaService.deleteOne(id);
    if (!media) throw new NotFoundException();
    return media;
  }
}
