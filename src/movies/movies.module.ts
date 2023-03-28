import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MoviesController } from "./controllers/movies.controller";
import { Movie, MovieSchema } from "./schemas/movie.schema";
import { MoviesService } from "./services/movies.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
