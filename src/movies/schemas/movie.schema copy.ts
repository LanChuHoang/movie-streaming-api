import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { COUNTRIES, MOVIE_GENRES } from "../constants/movie.constant";

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop()
  tagline: string;

  @Prop()
  overview: string;

  @Prop()
  adult: boolean;

  @Prop()
  runtime: number;

  @Prop()
  releaseDate: Date;

  @Prop()
  imdbID: string;

  @Prop()
  tmdbID: number;

  @Prop({ type: [String], enum: MOVIE_GENRES })
  genres: string[];

  @Prop({ type: [String], enum: COUNTRIES })
  countries: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
  })
  cast: ObjectId[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }] })
  directors: ObjectId[];

  @Prop()
  trailers: string[];

  @Prop()
  posterUrl: string;

  @Prop()
  thumbnailUrl: string;

  @Prop()
  backdropUrl: string;

  @Prop()
  videoUrl: string;

  @Prop({ required: true, default: false })
  isUpcoming: boolean;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
