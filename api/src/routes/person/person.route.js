const express = require("express");
const personController = require("./person.controller");
const routeValidator = require("../../validators/route.validator");
const authorizerService = require("../../services/authorizer.service");

const router = express.Router();

router.use(
  authorizerService.verifyAccessToken,
  routeValidator.parseDefaultProjection
);

// POST /person - post new person
router.post(
  "/",
  personController.postNewPerson,
  personController.updatePersonErrorHandler
);

// GET /person - get people
router.get(
  "/",
  authorizerService.authorizeAdmin,
  routeValidator.parseGetItemsParams,
  personController.getPeople
);

// GET /person/search - search people
router.get(
  "/search",
  authorizerService.authorizeAdmin,
  routeValidator.parseSearchItemsParams,
  personController.searchPeople
);

// GET /person/:id/ - get person detail
router.get("/:id", routeValidator.validateIDParam, personController.getPerson);

// GET /person/:id/credits - get person joined movies, shows
router.get(
  "/:id/credits",
  routeValidator.validateIDParam,
  personController.getCredits
);

// PATCH /person/:id - update person
router.patch(
  "/:id",
  routeValidator.validateIDParam,
  personController.updatePerson,
  personController.updatePersonErrorHandler
);

// DELETE /person/:id - delete person
router.delete(
  "/:id",
  routeValidator.validateIDParam,
  personController.deletePerson
);

module.exports = router;
