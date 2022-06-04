const mongoose = require("mongoose");
const idvalidator = require("mongoose-id-validator");
const { SHOW_GENRES, COUNTRIES } = require("../enum");

const episodeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    episodeNumber: { type: Number },
    airDate: { type: Date },
    runtime: { type: String },
    overview: { type: String },
    thumbnailUrl: { type: String },
    videoUrl: { type: String },
  },
  { timestamps: true }
);

const seasonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    seasonNumber: { type: Number },
    overview: { type: String },
    releaseDate: { type: Date },
    posterUrl: { type: String },
    backdropUrl: { type: String },
    episodes: { type: [episodeSchema] },
  },
  { timestamps: true }
);

const showSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    tagLine: { type: String },
    overview: { type: String },
    adult: { type: Boolean },
    releaseDate: { type: Date },
    imdbID: { type: String },
    genres: { type: [String], enum: SHOW_GENRES },
    countries: { type: [String], enum: COUNTRIES },
    people: { type: [mongoose.Schema.Types.ObjectId], ref: "Person" },
    trailers: { type: [String] },
    posterUrl: { type: String },
    thumbnailUrl: { type: String },
    backdropUrl: { type: String },
    firstAirDate: { type: Date },
    lastAirDate: { type: Date },
    seasons: { type: [seasonSchema] },
  },
  {
    timestamps: true,
  }
);

showSchema.plugin(idvalidator);

module.exports = mongoose.model("Show", showSchema);
