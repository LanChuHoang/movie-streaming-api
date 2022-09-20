const { MovieApi, ShowApi } = require("./tmdb.class.js");

const movieApi = new MovieApi();
const showApi = new ShowApi();

const tmdbModel = {
  itemType: {
    movie: "movie",
    show: "show",
  },
  movie: movieApi,
  show: showApi,
};

module.exports = tmdbModel;
