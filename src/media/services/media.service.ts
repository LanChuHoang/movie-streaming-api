import mongoose, { Model } from "mongoose";
import { BasePaginationDto } from "src/database/dto/pagination.dto";
import { PaginationService } from "src/database/services/pagination/pagination.service";
import { MediaDocument } from "src/media/schemas/media.schema";
import { CreateMediaDto } from "../dto/create-media.dto";
import { UpdateMediaDto } from "../dto/update-media.dto";

// prettier-ignore
export class MediaService<MediaType extends MediaDocument> extends PaginationService<MediaType> {
  constructor(model: Model<MediaType>) {
    super(model);
  }

    create(createMediaDto: CreateMediaDto) {
      return this.model.create(createMediaDto);
  }

  findOne(id: string) {
    return this.model.findById(id);
  }

  findAll(basePaginationDto: BasePaginationDto) {
    const options = basePaginationDto.toPaginationOptions();
    return this.pagination(options);
  }

  async findSimilar(id: string) {
    const media = await this.model.findById(id, { genres: 1 });
    if (!media?.genres) return [];
    const similarMovies = await this.model.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(id) },
          isUpcoming: false,
          genres: { $in: media.genres! },
        },
      },
      {
        $addFields: {
          numSimilar: {
            $size: { $setIntersection: [media.genres!, "$genres"] },
          },
        },
      },
      { $sort: { numSimilar: -1, releaseDate: -1 } },
      { $limit: 30 },
    ]);
    return similarMovies;
  }

  getRandom(limit: number) {
    return this.model.aggregate([
      { $match: { isUpcoming: false } },
      { $sample: { size: limit } },
      // { $project: PROJECTION.CUSTOM.ITEM_BASE_INFO },
    ]);
  }

  async getCredits(id: string) {
    const docs = await this.model
      .findById(id, {
        cast: 1,
        directors: 1,
        _id: 0,
      })
      .populate("cast", { name: 1, avatarUrl: 1 })
      .populate("directors", { name: 1, avatarUrl: 1 });
    return docs;
    // return { ...docs, cast: docs.cast.map((p) => ({ ...p, ...p._id })) };
  }

  updateOne(id: string, updateMediaDto: UpdateMediaDto) {
    return this.model.findByIdAndUpdate(id, updateMediaDto, {
      returnDocument: "after",
    });
  }

  deleteOne(id: string) {
    return this.model.findByIdAndDelete(id, { returnDocument: "after" });
  }
}
