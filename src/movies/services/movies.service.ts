import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MediaService } from "src/media/services/media.service";
import { Movie, MovieDocument } from "../schemas/movie.schema";

@Injectable()
export class MoviesService extends MediaService<MovieDocument> {
  constructor(@InjectModel(Movie.name) movieModel: Model<MovieDocument>) {
    super(movieModel);
  }

  async getJoinedMovies(personId: string) {
    const [cast, director] = await Promise.all([
      this.model.find({ cast: personId }).sort({ releaseDate: -1 }),
      this.model.find({ directors: personId }).sort({ releaseDate: -1 }),
    ]);
    return { cast, director };
  }
}
