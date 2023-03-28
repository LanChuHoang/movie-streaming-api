import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Movie, MovieDocument } from "../schemas/movie.schema";

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>,
  ) {}

  async createMovie(createMovieDto: any) {
    return this.movieModel.create(createMovieDto);
  }

  async getMovieById(id: string) {
    return this.movieModel.findById(id);
  }

  async updateMovie(id: string, updateMovieCto: any) {
    return this.movieModel.findByIdAndUpdate(id, updateMovieCto, {
      returnDocument: "after",
      runValidators: true,
    });
  }

  async deleteMovie(id: string) {
    return this.movieModel.findByIdAndDelete(id);
  }
}
