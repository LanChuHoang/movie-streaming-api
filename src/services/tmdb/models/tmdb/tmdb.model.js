const { TmdbMovieApi, TmdbShowApi, TmdbPersonApi } = require("./tmdb.class.js");

const movieApi = new TmdbMovieApi();
const showApi = new TmdbShowApi();
const personApi = new TmdbPersonApi();

const tmdbModel = {
  itemType: {
    movie: "movie",
    show: "show",
    person: "person",
  },
  movie: movieApi,
  show: showApi,
  person: personApi,
};

module.exports = tmdbModel;
