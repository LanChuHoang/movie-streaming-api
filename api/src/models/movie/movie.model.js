const mongoose = require("mongoose");
const { MOVIE_GENRES, COUNTRIES } = require("../enum");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    tagLine: { type: String },
    overview: { type: String },
    adult: { type: Boolean },
    runtime: { type: Number },
    releaseDate: { type: Date },
    imdbID: { type: String },
    genres: { type: [String], enum: MOVIE_GENRES },
    countries: { type: [String], enum: COUNTRIES },
    people: { type: [Schema.Types.ObjectId], ref: "Person" },
    trailers: { type: [String] },
    posterUrl: { type: String },
    thumbnailUrl: { type: String },
    backdropUrl: { type: String },
    videoUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
