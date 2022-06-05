const mongoose = require("mongoose");
const {
  errorResponse,
  DEFAULT_PAGE_SIZE,
} = require("../../configs/route.config");
const movieService = require("../../models/movie/movie.service");

function updateMovieErrorHandler(error, req, res) {
  console.log(error);
  if (error.code === 11000) {
    return res.status(400).json({ error: "Movie is already exist" });
  }
  if (error.errors?.title?.kind === "required") {
    return res.status(400).json({ error: "Missing title field" });
  }
  if (error.errors?.["genres.0"]?.kind === "enum") {
    return res.status(400).json({ error: "Invalid genres" });
  }
  if (error.errors?.["countries.0"]?.kind === "enum") {
    return res.status(400).json({ error: "Invalid countries" });
  }
  if (error.errors?.people) {
    return res.status(400).json({ error: "Invalid people" });
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
    if (req.query.page) {
      req.query.page = Number(req.query.page);
      if (isNaN(req.query.page))
        return res.status(400).json(errorResponse.INVALID_QUERY);
    }

    if (req.query.year) {
      req.query.year = Number(req.query.year);
      if (isNaN(req.query.page))
        return res.status(400).json(errorResponse.INVALID_QUERY);
    }

    const movies = await movieService.getMovies({
      genre: req.query.genre,
      country: req.query.country,
      year: req.query.year,
      sort: req.query.sort,
      page: req.query.page,
    });
    const response = {
      docs: movies,
      page: req.query.page || 1,
      pageSize: DEFAULT_PAGE_SIZE,
      total_number_of_pages: await movieService.getNumPages(),
    };
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
  postNewMovie,
  getMovies,
  getMovie,
  getRandomMovie,
  updateMovie,
  deleteMovie,
};
