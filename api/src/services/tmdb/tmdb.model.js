const { MovieApi } = require("./tmdb.class.js");

const movieApi = new MovieApi();

const tmdbModel = {
  movie: movieApi,
};

module.exports = tmdbModel;
