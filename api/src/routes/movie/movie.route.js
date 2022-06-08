const express = require("express");
const movieController = require("./movie.controller");

const router = express.Router();

// POST /movie - post new movie
// input: {title: required, optionals}
router.post("/", movieController.postNewMovie);

// GET /movie?genres & country & year  & sort & page
router.get("/", movieController.getMovies);

// GET /movie/upcoming?page - get upcoming movies
router.get("/upcoming", movieController.getUpcomingMovies);

// GET /movie/search?query&page
router.get("/search", movieController.searchMovies);

// GET /movie/random - get random movie
router.get("/random", movieController.getRandomMovie);

// GET /movie/:id/ - get movie detail
router.get("/:id", movieController.getMovie);

// PATCH /movie/:id - update movie
router.patch("/:id", movieController.updateMovie);

// DELETE /movie/:id - delete movie
router.delete("/:id", movieController.deleteMovie);

module.exports = router;
