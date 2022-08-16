const express = require("express");
const routeValidator = require("../../validators/route.validator");
const movieController = require("./movie.controller");
const authorizerService = require("../../services/authorizer.service");

const router = express.Router();

router.use(
  authorizerService.verifyAccessToken,
  routeValidator.parseDefaultProjection
);

// POST /movie - post new movie
// input: {title: required, optionals}
router.post(
  "/",
  movieController.postNewMovie,
  movieController.updateMovieErrorHandler
);

// GET /movie?genres & country & year & upcoming & sort & page & limit & fields
router.get(
  "/",
  routeValidator.parseGetItemsParams,
  movieController.parseGetMoviesParams,
  movieController.parseUpcomingParam,
  movieController.getMovies
);

// GET /movie/search?query & upcoming & page & limit & fields
router.get(
  "/search",
  routeValidator.parseSearchItemsParams,
  movieController.parseUpcomingParam,
  movieController.searchMovies
);

// GET /movie/similar
router.get(
  "/:id/similar",
  routeValidator.validateIDParam,
  movieController.getSimilarMovies
);

// GET /movie/random - get random movie
router.get("/random", movieController.getRandomMovie);

// GET /movie/:id/ - get movie detail
router.get("/:id", routeValidator.validateIDParam, movieController.getMovie);

// PATCH /movie/:id - update movie
router.patch(
  "/:id",
  routeValidator.validateIDParam,
  movieController.updateMovie,
  movieController.updateMovieErrorHandler
);

// DELETE /movie/:id - delete movie
router.delete(
  "/:id",
  routeValidator.validateIDParam,
  movieController.deleteMovie
);

module.exports = router;
