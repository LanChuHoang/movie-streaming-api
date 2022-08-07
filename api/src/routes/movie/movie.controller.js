const mongoose = require("mongoose");
const { errorResponse } = require("../../configs/route.config");
const movieModel = require("../../models/movie/movie.model");
const { MOVIE_GENRES, COUNTRIES } = require("../../models/enum");

function validateGetMovieParams(req, res, next) {
  if (req.query.genre && !MOVIE_GENRES.includes(req.query.genre)) {
    return res.status(400).json(errorResponse.INVALID_QUERY);
  }

  if (req.query.country && !COUNTRIES.includes(req.query.country)) {
    return res.status(400).json(errorResponse.INVALID_QUERY);
  }

  if (req.query.year) {
    req.query.year = Number(req.query.year);
    if (isNaN(req.query.year))
      return res.status(400).json(errorResponse.INVALID_QUERY);
  }

  next();
}

// POST /movie - post new movie
// input: {title: required, optionals}
async function postNewMovie(req, res, next) {
  try {
    const createdMovie = await movieModel.addMovie(req.body);
    return res.status(201).json(createdMovie);
  } catch (error) {
    next(error);
  }
}

// GET /movie?genre & country & year & sort & page
async function getMovies(req, res, next) {
  try {
    const options = {
      genre: req.query.genre,
      country: req.query.country,
      year: req.query.year,
      sort: req.query.sort,
      page: req.query.page,
      limit: +req.query.limit,
    };
    console.log(options);
    const response = await movieModel.getMovies(options);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// GET /movie/upcoming?page - get upcoming movies
async function getUpcomingMovies(req, res, next) {
  try {
    const response = await movieModel.getUpcomingMovies(req.query.page);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// GET /movie/search?query&page
async function searchMovies(req, res, next) {
  try {
    const response = await movieModel.getMoviesByTitle(
      req.query.query,
      req.query.page
    );
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// GET /movie/similar - get similar movies
async function getSimilarMovies(req, res, next) {
  if (!(await movieModel.getMovieByID(req.params.id)))
    return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
  try {
    const response = await movieModel.getSimilarMovies(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// GET /movie/random - get random movie
async function getRandomMovie(req, res, next) {
  try {
    const randomMovie = await movieModel.getRandomMovie();
    if (!randomMovie)
      return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(randomMovie);
  } catch (error) {
    next(error);
  }
}

// GET /movie/:id/ - get movie detail
async function getMovie(req, res, next) {
  try {
    const movie = await movieModel.getMovieByID(req.params.id);
    if (!movie) return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
}

// PATCH /movie/:id - update movie
async function updateMovie(req, res, next) {
  try {
    const updatedMovie = await movieModel.updateMovie(req.params.id, req.body);
    if (!updatedMovie)
      return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(updatedMovie);
  } catch (error) {
    next(error);
  }
}

// DELETE /movie/:id - delete movie
async function deleteMovie(req, res, next) {
  try {
    const deletedMovie = await movieModel.deleteMovieByID(req.params.id);
    if (!deletedMovie)
      return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(deletedMovie);
  } catch (error) {
    next(error);
  }
}

function updateMovieErrorHandler(error, req, res, next) {
  console.log(error);
  if (error.code === 11000) {
    return res.status(400).json(errorResponse.MOVIE_EXISTED);
  }
  if (error.errors?.title?.kind === "required") {
    return res.status(400).json(errorResponse.MISSING_TITLE);
  }
  if (error.errors?.["genres.0"]?.kind === "enum") {
    return res.status(400).json(errorResponse.INVALID_GENRES);
  }
  if (error.errors?.["countries.0"]?.kind === "enum") {
    return res.status(400).json(errorResponse.INVALID_COUNTRIES);
  }
  if (error.errors?.people) {
    return res.status(400).json(errorResponse.INVALID_PEOPLE);
  }
  if (
    error instanceof mongoose.Error.CastError ||
    (error.errors &&
      Object.values(error.errors)[0] instanceof mongoose.Error.CastError)
  ) {
    return res.status(400).json(errorResponse.INVALID_QUERY);
  }
  return res.status(500).json(errorResponse.DEFAULT_500_ERROR);
}

module.exports = {
  validateGetMovieParams,
  postNewMovie,
  getMovies,
  getUpcomingMovies,
  searchMovies,
  getSimilarMovies,
  getMovie,
  getRandomMovie,
  updateMovie,
  deleteMovie,
  updateMovieErrorHandler,
};
