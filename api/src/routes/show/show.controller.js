const mongoose = require("mongoose");
const {
  errorResponse,
  showSortOptions,
} = require("../../configs/route.config");
const showModel = require("../../models/show/show.model");
const { SHOW_GENRES, COUNTRIES } = require("../../models/enum");

function validateGetShowParams(req, res, next) {
  if (req.query.genre && !SHOW_GENRES.includes(req.query.genre)) {
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

  if (req.query.sort && !showSortOptions[req.query.sort]) {
    return res.status(400).json(errorResponse.INVALID_QUERY);
  }

  next();
}

// POST /Show - post new Show
// input: {title: required, optionals}
async function postNewShow(req, res, next) {
  try {
    const createdShow = await showModel.addShow(req.body);
    return res.status(201).json(createdShow);
  } catch (error) {
    next(error);
  }
}

// GET /Show?genre & country & year & sort & page
async function getShows(req, res, next) {
  try {
    const options = {
      genre: req.query.genre,
      country: req.query.country,
      year: req.query.year,
      sort: showSortOptions[req.query.sort],
      page: req.query.page,
    };
    const response = await showModel.getShows(options);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// GET /show/search?query&page
async function searchShows(req, res, next) {
  try {
    const response = await showModel.getShowsByTitle(
      req.query.query,
      req.query.page
    );
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// GET /show/similar - get similar shows
async function getSimilarShows(req, res, next) {
  try {
    const response = await showModel.getSimilarShows(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// GET /Show/random - get random Show
async function getRandomShow(req, res, next) {
  try {
    const randomShow = await showModel.getRandomShow();
    if (!randomShow)
      return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(randomShow);
  } catch (error) {
    next(error);
  }
}

// GET /Show/:id/ - get Show detail
async function getShow(req, res, next) {
  try {
    const show = await showModel.getShowByID(req.params.id);
    if (!show) return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(show);
  } catch (error) {
    next(error);
  }
}

// PATCH /Show/:id - update Show
async function updateShow(req, res, next) {
  try {
    const updatedShow = await showModel.updateShow(req.params.id, req.body);
    if (!updatedShow)
      return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(updatedShow);
  } catch (error) {
    next(error);
  }
}

// DELETE /Show/:id - delete Show
async function deleteShow(req, res, next) {
  try {
    const deletedShow = await showModel.deleteShowByID(req.params.id);
    if (!deletedShow)
      return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(deletedShow);
  } catch (error) {
    next(error);
  }
}

function updateShowErrorHandler(error, req, res, next) {
  console.log(error);
  if (error.code === 11000) {
    return res.status(400).json({ error: "Show is already exist" });
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

module.exports = {
  validateGetShowParams,
  postNewShow,
  getShows,
  searchShows,
  getSimilarShows,
  getShow,
  getRandomShow,
  updateShow,
  deleteShow,
  updateShowErrorHandler,
};
