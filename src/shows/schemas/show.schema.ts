import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Media } from "src/media/schemas/media.schema";

export type ShowDocument = HydratedDocument<Show>;

@Schema({ timestamps: true })
export class Episode {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, min: 0 })
  episodeNumber: number;

  @Prop()
  airDate: Date;

  @Prop()
  runtime: number;

  @Prop()
  overview: string;

  @Prop()
  thumbnailUrl: string;

  @Prop()
  videoUrl: string;
}

const EpisodeSchema = SchemaFactory.createForClass(Episode);

@Schema({ timestamps: true })
export class Season {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, min: 0 })
  seasonNumber: number;

  @Prop()
  overview: string;

  @Prop()
  releaseDate: Date;

  @Prop()
  posterUrl: string;

  @Prop()
  backdropUrl: string;

  @Prop({ type: [EpisodeSchema] })
  episodes: Episode[];
}

const SeasonSchema = SchemaFactory.createForClass(Season);

@Schema({ timestamps: true })
export class Show extends Media {
  @Prop()
  firstAirDate: Date;

  @Prop()
  lastAirDate: Date;

  @Prop({ type: [String], enum: [] })
  genres: string[];

  @Prop({ type: [SeasonSchema] })
  seasons: Season[];
}

export const ShowSchema = SchemaFactory.createForClass(Show);
