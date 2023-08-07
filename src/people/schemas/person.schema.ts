import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { GENDERS, JOBS } from "../constants/constants";

export type PersonDocument = HydratedDocument<Person>;

@Schema({ timestamps: true })
export class Person {
  @Prop()
  name: string;

  @Prop({ enum: GENDERS })
  gender: string;

  @Prop()
  dob: Date;

  @Prop()
  dod: Date;

  @Prop()
  pob: string;

  @Prop({ enum: JOBS })
  job: string;

  @Prop()
  biography: string;

  @Prop()
  avatarUrl: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop()
  imdbID: string;

  @Prop()
  tmdbID: number;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
