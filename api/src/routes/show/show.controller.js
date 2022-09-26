const mongoose = require("mongoose");
const { errorResponse } = require("../../configs/route.config");
const showModel = require("../../models/show/show.model");
const { SHOW_GENRES } = require("../../models/enum");
const routeValidator = require("../../validators/route.validator");

function validateGenre(req, res, next) {
  const { genre } = req.query;
  if (genre && !SHOW_GENRES.includes(genre))
    return res.status(400).send(errorResponse.INVALID_QUERY);
  next();
}

const parseGetShowsParams = [
  validateGenre,
  routeValidator.validateCountryParam,
  routeValidator.parseYearParam,
];

async function postNewShow(req, res, next) {
  try {
    const createdShow = await showModel.addShow(req.body);
    return res.status(201).send(createdShow);
  } catch (error) {
    next(error);
  }
}

async function getShows(req, res, next) {
  try {
    const options = {
      genre: req.query.genre,
      country: req.query.country,
      year: req.query.year,
      sort: req.query.sort,
      page: req.query.page,
      limit: req.query.limit,
      projection: req.query.projection,
    };
    const response = await showModel.getShows(options);
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
}

async function searchShows(req, res, next) {
  try {
    const options = {
      query: req.query.query,
      page: req.query.page,
      limit: req.query.limit,
      projection: req.query.projection,
    };
    const response = await showModel.getShowsByTitle(options);
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
}

async function getSimilarShows(req, res, next) {
  try {
    const response = await showModel.getSimilarShows(req.params.id);
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
}

async function getShow(req, res, next) {
  try {
    const show = await showModel.getShowByID(
      req.params.id,
      req.query.defaultProjection
    );
    if (!show) return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).send(show);
  } catch (error) {
    next(error);
  }
}

async function getSeasons(req, res, next) {
  try {
    const seasons = await showModel.getSeasons(req.params.id);
    return res.send(seasons);
  } catch (error) {
    next(error);
  }
}

async function getCredits(req, res, next) {
  try {
    const credits = await showModel.getCredits(req.params.id);
    return res.send(credits);
  } catch (error) {
    next(error);
  }
}

async function getRandomShow(req, res, next) {
  try {
    const randomShow = await showModel.getRandomShow();
    if (!randomShow)
      return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).send(randomShow);
  } catch (error) {
    next(error);
  }
}

async function updateShow(req, res, next) {
  try {
    const updatedShow = await showModel.updateShow(req.params.id, req.body);
    if (!updatedShow)
      return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).send(updatedShow);
  } catch (error) {
    next(error);
  }
}

async function deleteShow(req, res, next) {
  try {
    const deletedShow = await showModel.deleteShowByID(req.params.id);
    if (!deletedShow)
      return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).send(deletedShow);
  } catch (error) {
    next(error);
  }
}

function updateShowErrorHandler(error, req, res, next) {
  console.log(error);
  if (error.code === 11000) {
    return res.status(400).send({ error: "Show is already exist" });
  }
  if (error.errors?.title?.kind === "required") {
    return res.status(400).send({ error: "Missing title field" });
  }
  if (error.errors?.["genres.0"]?.kind === "enum") {
    return res.status(400).send({ error: "Invalid genres" });
  }
  if (error.errors?.["countries.0"]?.kind === "enum") {
    return res.status(400).send({ error: "Invalid countries" });
  }
  if (error.errors?.people) {
    return res.status(400).send({ error: "Invalid people" });
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
  parseGetShowsParams,
  postNewShow,
  getShows,
  searchShows,
  getSimilarShows,
  getShow,
  getSeasons,
  getCredits,
  getRandomShow,
  updateShow,
  deleteShow,
  updateShowErrorHandler,
};
