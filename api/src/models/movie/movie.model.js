const mongoose = require("mongoose");
const idvalidator = require("mongoose-id-validator");
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
    genres: { type: [String], enum: MOVIE_GENRES },
    countries: { type: [String], enum: COUNTRIES },
    cast: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
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

// movieSchema.plugin(idvalidator);

module.exports = mongoose.model("Movie", movieSchema);
