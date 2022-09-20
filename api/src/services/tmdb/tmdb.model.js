const { MovieApi, ShowApi, PersonApi } = require("./tmdb.class.js");

const movieApi = new MovieApi();
const showApi = new ShowApi();
const personApi = new PersonApi();

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
