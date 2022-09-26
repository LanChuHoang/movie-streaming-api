const mongoose = require("mongoose");
const { MOVIE_GENRES, COUNTRIES } = require("../enum");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    tagline: { type: String },
    overview: { type: String },
    adult: { type: Boolean },
    runtime: { type: Number },
    releaseDate: { type: Date },
    imdbID: { type: String },
    tmdbID: { type: Number },
    genres: { type: [String], enum: MOVIE_GENRES },
    countries: { type: [String], enum: COUNTRIES },
    cast: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
        character: { type: "String", required: true },
      },
    ],
    directors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
    trailers: { type: [String] },
    posterUrl: { type: String },
    thumbnailUrl: { type: String },
    backdropUrl: { type: String },
    videoUrl: { type: String },
    isUpcoming: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
