const express = require("express");
const showController = require("./show.controller");

const router = express.Router();

// POST /show - post new show
// input: {title: required, optionals}
router.post("/", showController.postNewShow);

// GET /show?genres & country & year  & sort & page
router.get("/", showController.getShows);

// GET /show?query&page
router.get("/search", showController.searchShows);

// GET /show/random - get random show
router.get("/random", showController.getRandomShow);

// GET /show/:id/ - get show detail
router.get("/:id", showController.getShow);

// PATCH /show/:id - update show
router.patch("/:id", showController.updateShow);

// DELETE /show/:id - delete show
router.delete("/:id", showController.deleteShow);

module.exports = router;
