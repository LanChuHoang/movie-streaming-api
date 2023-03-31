import {
  Body,
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
import { BasePaginationDto } from "src/database/dto/pagination.dto";
import { MediaDocument } from "src/media/schemas/media.schema";
import { CreateMediaDto } from "../dto/create-media.dto";
import { UpdateMediaDto } from "../dto/update-media.dto";
import { MediaService } from "../services/media.service";

export class MediaController<
  MediaType extends MediaDocument,
  CreateItemDto extends CreateMediaDto,
  UpdateItemDto extends UpdateMediaDto,
  GetItemsDto extends BasePaginationDto,
  SearchItemsDto extends BasePaginationDto,
> {
  constructor(private readonly mediaService: MediaService<MediaType>) {}

  @Post()
  createMedia(@Body() createMediaDto: CreateItemDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Get("")
  getManyMedia(@Query() query: GetItemsDto) {
    return this.mediaService.findAll(query);
  }

  @Get("search")
  searchMedia(@Query() query: SearchItemsDto) {
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

  @Patch(":id")
  async updateMedia(
    @Param("id") id: string,
    @Body() updateMediaDto: UpdateItemDto,
  ) {
    const media = await this.mediaService.updateOne(id, updateMediaDto);
    if (!media) throw new NotFoundException();
    return media;
  }

  @Delete(":id")
  async deleleMedia(@Param("id") id: string) {
    const media = await this.mediaService.deleteOne(id);
    if (!media) throw new NotFoundException();
    return media;
  }
}
