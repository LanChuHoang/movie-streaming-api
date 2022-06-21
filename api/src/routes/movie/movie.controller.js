const mongoose = require("mongoose");
const {
  errorResponse,
  movieSortOptions,
} = require("../../configs/route.config");
const movieService = require("../../models/movie/movie.service");
const { MOVIE_GENRES, COUNTRIES } = require("../../models/enum");

function updateMovieErrorHandler(error, req, res) {
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

  if (req.query.sort && !movieSortOptions[req.query.sort]) {
    return res.status(400).json(errorResponse.INVALID_QUERY);
  }

  next();
}

// POST /movie - post new movie
// input: {title: required, optionals}
async function postNewMovie(req, res) {
  try {
    const createdMovie = await movieService.addMovie(req.body);
    return res.status(201).json(createdMovie);
  } catch (error) {
    updateMovieErrorHandler(error, req, res);
  }
}

// GET /movie?genre & country & year & sort & page
async function getMovies(req, res) {
  try {
    const options = {
      genre: req.query.genre,
      country: req.query.country,
      year: req.query.year,
      sort: movieSortOptions[req.query.sort],
      page: req.query.page,
    };
    const response = await movieService.getMovies(options);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse.DEFAULT_500_ERROR);
  }
}

// GET /movie/upcoming?page - get upcoming movies
async function getUpcomingMovies(req, res) {
  try {
    const response = await movieService.getUpcomingMovies(req.query.page);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse.DEFAULT_500_ERROR);
  }
}

// GET /movie/search?query&page
async function searchMovies(req, res) {
  try {
    const response = await movieService.getMoviesByTitle(
      req.query.query,
      req.query.page
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse.DEFAULT_500_ERROR);
  }
}

// GET /movie/similar - get similar movies
async function getSimilarMovies(req, res) {
  if (!(await movieService.getMovieByID(req.params.id)))
    return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
  try {
    const response = await movieService.getSimilarMovies(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse.DEFAULT_500_ERROR);
  }
}

// GET /movie/random - get random movie
async function getRandomMovie(req, res) {
  try {
    const randomMovie = await movieService.getRandomMovie();
    if (!randomMovie)
      return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(randomMovie);
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse.DEFAULT_500_ERROR);
  }
}

// GET /movie/:id/ - get movie detail
async function getMovie(req, res) {
  try {
    const movie = await movieService.getMovieByID(req.params.id);
    if (!movie) return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse.DEFAULT_500_ERROR);
  }
}

// PATCH /movie/:id - update movie
async function updateMovie(req, res) {
  try {
    const updatedMovie = await movieService.updateMovie(
      req.params.id,
      req.body
    );
    if (!updatedMovie)
      return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(updatedMovie);
  } catch (error) {
    updateMovieErrorHandler(error, req, res);
  }
}

// DELETE /movie/:id - delete movie
async function deleteMovie(req, res) {
  try {
    const deletedMovie = await movieService.deleteMovieByID(req.params.id);
    if (!deletedMovie)
      return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(deletedMovie);
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse.DEFAULT_500_ERROR);
  }
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
};
