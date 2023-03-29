import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MediaService } from "src/database/services/media/media.service";
import { Movie, MovieDocument } from "../schemas/movie.schema";

@Injectable()
export class MoviesService extends MediaService<MovieDocument> {
  constructor(@InjectModel(Movie.name) movieModel: Model<MovieDocument>) {
    super(movieModel);
  }
}
