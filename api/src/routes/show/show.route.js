const express = require("express");
const routeValidator = require("../../validators/route.validator");
const showController = require("./show.controller");

const router = express.Router();

// POST /show - post new show
// input: {title: required, optionals}
router.post("/", showController.postNewShow);

// GET /show?genres & country & year  & sort & page
router.get(
  "/",
  routeValidator.validatePageParam,
  showController.validateGetShowParams,
  showController.getShows
);

// GET /show/search?query&page
router.get(
  "/search",
  routeValidator.validateSearchParams,
  showController.searchShows
);

// GET /show/random - get random show
router.get("/random", showController.getRandomShow);

// GET /show/similar
router.get(
  "/:id/similar",
  routeValidator.validateIDParam,
  showController.getSimilarShows
);

// GET /show/:id/ - get show detail
router.get("/:id", routeValidator.validateIDParam, showController.getShow);

// PATCH /show/:id - update show
router.patch("/:id", routeValidator.validateIDParam, showController.updateShow);

// DELETE /show/:id - delete show
router.delete(
  "/:id",
  routeValidator.validateIDParam,
  showController.deleteShow
);

module.exports = router;
