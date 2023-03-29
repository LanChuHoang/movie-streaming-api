import { Prop, Schema } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { COUNTRIES } from "src/constants/country.constant";
import { Person } from "src/people/schemas/person.schema";

export type MediaDocument = HydratedDocument<Media>;

@Schema({ timestamps: true })
export class Media {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop()
  tagline: string;

  @Prop()
  overview: string;

  @Prop()
  adult: boolean;

  @Prop()
  imdbID: string;

  @Prop()
  tmdbID: number;

  @Prop({ type: [String] })
  genres: string[];

  @Prop({ type: [String], enum: COUNTRIES })
  countries: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
  })
  cast: Person[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }] })
  directors: Person[];

  @Prop()
  trailers: string[];

  @Prop()
  posterUrl: string;

  @Prop()
  thumbnailUrl: string;

  @Prop()
  backdropUrl: string;
}
