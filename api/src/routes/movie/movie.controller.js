const mongoose = require("mongoose");
const { errorResponse } = require("../../configs/route.config");
const movieModel = require("../../models/movie/movie.model");
const { MOVIE_GENRES } = require("../../models/enum");
const routeValidator = require("../../validators/route.validator");

function validateGenreParam(req, res, next) {
  const { genre } = req.query;
  if (genre && !MOVIE_GENRES.includes(genre))
    return res.status(400).send(errorResponse.INVALID_QUERY);
  next();
}

const parseGetMoviesParams = [
  validateGenreParam,
  routeValidator.validateCountryParam,
  routeValidator.parseYearParam,
];

function parseUpcomingParam(req, res, next) {
  const { upcoming } = req.query;
  switch (upcoming) {
    case "true":
      req.query.upcoming = true;
      break;
    case "false":
      req.query.upcoming = false;
      break;
    default:
      if (upcoming) return res.status(400).send(errorResponse.INVALID_QUERY);
      req.query.upcoming = undefined;
      break;
  }
  next();
}

async function postNewMovie(req, res, next) {
  try {
    const createdMovie = await movieModel.addMovie(req.body);
    return res.status(201).send(createdMovie);
  } catch (error) {
    next(error);
  }
}

async function getMovies(req, res, next) {
  try {
    const options = {
      genre: req.query.genre,
      country: req.query.country,
      year: req.query.year,
      isUpcoming: req.query.upcoming,
      sort: req.query.sort,
      page: req.query.page,
      limit: req.query.limit,
      projection: req.query.projection,
    };
    const response = await movieModel.getMovies(options);
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
}

async function searchMovies(req, res, next) {
  try {
    const options = {
      query: req.query.query,
      isUpcoming: req.query.upcoming,
      page: req.query.page,
      limit: req.query.limit,
      projection: req.query.projection,
    };
    const response = await movieModel.getMoviesByTitle(options);
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
}

async function getSimilarMovies(req, res, next) {
  if (!(await movieModel.getMovieByID(req.params.id)))
    return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
  try {
    const response = await movieModel.getSimilarMovies(req.params.id);
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
}

async function getMovie(req, res, next) {
  try {
    const movie = await movieModel.getMovieByID(
      req.params.id,
      req.query.defaultProjection
    );
    if (!movie) return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).send(movie);
  } catch (error) {
    next(error);
  }
}

async function getCredits(req, res, next) {
  try {
    const credits = await movieModel.getCredits(req.params.id);
    return res.send(credits);
  } catch (error) {
    next(error);
  }
}

async function getRandomMovie(req, res, next) {
  try {
    const randomMovie = await movieModel.getRandomMovie();
    if (!randomMovie)
      return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).send(randomMovie);
  } catch (error) {
    next(error);
  }
}

async function updateMovie(req, res, next) {
  try {
    const updatedMovie = await movieModel.updateMovie(req.params.id, req.body);
    if (!updatedMovie)
      return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).send(updatedMovie);
  } catch (error) {
    next(error);
  }
}

async function deleteMovie(req, res, next) {
  try {
    const deletedMovie = await movieModel.deleteMovieByID(req.params.id);
    if (!deletedMovie)
      return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).send(deletedMovie);
  } catch (error) {
    next(error);
  }
}

function updateMovieErrorHandler(error, req, res, next) {
  console.log(error);
  if (error.code === 11000) {
    return res.status(400).send(errorResponse.MOVIE_EXISTED);
  }
  if (error.errors?.title?.kind === "required") {
    return res.status(400).send(errorResponse.MISSING_TITLE);
  }
  if (error.errors?.["genres.0"]?.kind === "enum") {
    return res.status(400).send(errorResponse.INVALID_GENRES);
  }
  if (error.errors?.["countries.0"]?.kind === "enum") {
    return res.status(400).send(errorResponse.INVALID_COUNTRIES);
  }
  if (error.errors?.people) {
    return res.status(400).send(errorResponse.INVALID_PEOPLE);
  }
  if (
    error instanceof mongoose.Error.CastError ||
    (error.errors &&
      Object.values(error.errors)[0] instanceof mongoose.Error.CastError)
  ) {
    return res.status(400).send(errorResponse.INVALID_QUERY);
  }
  return res.status(500).send(errorResponse.DEFAULT_500_ERROR);
}

module.exports = {
  parseGetMoviesParams,
  parseUpcomingParam,
  postNewMovie,
  getMovies,
  searchMovies,
  getSimilarMovies,
  getMovie,
  getCredits,
  getRandomMovie,
  updateMovie,
  deleteMovie,
  updateMovieErrorHandler,
};
