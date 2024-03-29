import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MediaService } from "src/media/services/media.service";
import { Show, ShowDocument } from "../schemas/show.schema";

@Injectable()
export class ShowsService extends MediaService<ShowDocument> {
  constructor(@InjectModel(Show.name) movieModel: Model<ShowDocument>) {
    super(movieModel);
  }

  async getSeasons(id: string) {
    const show = await this.model.findById(id, { seasons: 1 });
    return show ? show.seasons : undefined;
  }

  async getSeason(showId: string, seasonNumber: number) {
    const show = await this.model.findById(showId, {
      seasons: { $elemMatch: { seasonNumber } },
    });
    return show?.seasons?.[0];
  }

  async getEpisode(
    showId: string,
    seasonNumber: number,
    episodeNumber: number,
  ) {
    const [response] = await this.model.aggregate([
      {
        $match: { _id: new Types.ObjectId(showId) },
      },
      {
        $project: {
          season: {
            $first: {
              $filter: {
                input: "$seasons",
                as: "season",
                cond: { $eq: ["$$season.seasonNumber", seasonNumber] },
              },
            },
          },
        },
      },
      {
        $project: {
          episode: {
            $first: {
              $filter: {
                input: "$season.episodes",
                as: "episode",
                cond: { $eq: ["$$episode.episodeNumber", episodeNumber] },
              },
            },
          },
        },
      },
    ]);
    return response?.episode;
  }

  async getJoinedShows(personId: string) {
    const [cast, director] = await Promise.all([
      this.model.find({ "cast._id": personId }, {}).sort({ lastAirDate: -1 }),
      this.model.find({ directors: personId }, {}).sort({ lastAirDate: -1 }),
    ]);
    return { cast, director };
  }
}
