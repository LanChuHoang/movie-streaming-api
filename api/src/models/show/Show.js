const mongoose = require("mongoose");
const idvalidator = require("mongoose-id-validator");
const { SHOW_GENRES, COUNTRIES } = require("../enum");

const episodeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    episodeNumber: { type: Number },
    airDate: { type: Date },
    runtime: { type: Number },
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
    tagline: { type: String },
    overview: { type: String },
    adult: { type: Boolean },
    imdbID: { type: String },
    tmdbID: { type: Number },
    genres: { type: [String], enum: SHOW_GENRES },
    countries: { type: [String], enum: COUNTRIES },
    cast: { type: [mongoose.Schema.Types.ObjectId], ref: "Person" },
    directors: { type: [mongoose.Schema.Types.ObjectId], ref: "Person" },
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

module.exports = mongoose.model("Show", showSchema);
