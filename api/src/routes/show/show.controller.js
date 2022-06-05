const mongoose = require("mongoose");
const {
  errorResponse,
  DEFAULT_PAGE_SIZE,
} = require("../../configs/route.config");
const showService = require("../../models/show/show.service");

function updateShowErrorHandler(error, req, res) {
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

// POST /Show - post new Show
// input: {title: required, optionals}
async function postNewShow(req, res) {
  try {
    const createdShow = await showService.addShow(req.body);
    return res.status(201).json(createdShow);
  } catch (error) {
    updateShowErrorHandler(error, req, res);
  }
}

// GET /Show?genre & country & year & sort & page
async function getShows(req, res) {
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

    const shows = await showService.getShows({
      genre: req.query.genre,
      country: req.query.country,
      year: req.query.year,
      sort: req.query.sort,
      page: req.query.page,
    });
    const response = {
      docs: shows,
      page: req.query.page || 1,
      pageSize: DEFAULT_PAGE_SIZE,
      total_number_of_pages: await showService.getNumPages(),
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse.DEFAULT_500_ERROR);
  }
}

// GET /Show/random - get random Show
async function getRandomShow(req, res) {
  try {
    const randomShow = await showService.getRandomShow();
    if (!randomShow)
      return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(randomShow);
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse.DEFAULT_500_ERROR);
  }
}

// GET /Show/:id/ - get Show detail
async function getShow(req, res) {
  try {
    const show = await showService.getShowByID(req.params.id);
    if (!show) return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(show);
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse.DEFAULT_500_ERROR);
  }
}

// PATCH /Show/:id - update Show
async function updateShow(req, res) {
  try {
    const updatedShow = await showService.updateShow(req.params.id, req.body);
    if (!updatedShow)
      return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(updatedShow);
  } catch (error) {
    updateShowErrorHandler(error, req, res);
  }
}

// DELETE /Show/:id - delete Show
async function deleteShow(req, res) {
  try {
    const deletedShow = await showService.getShowByID(req.params.id);
    if (!deletedShow)
      return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(deletedShow);
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse.DEFAULT_500_ERROR);
  }
}

module.exports = {
  postNewShow,
  getShows,
  getShow,
  getRandomShow,
  updateShow,
  deleteShow,
};