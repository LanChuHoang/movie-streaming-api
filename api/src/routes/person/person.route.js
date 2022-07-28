const express = require("express");
const personController = require("./person.controller");
const routeValidator = require("../../validators/route.validator");
const authorizerService = require("../../services/authorizer.service");

const router = express.Router();

router.use(authorizerService.verifyAccessToken);

// POST /person - post new person
router.post(
  "/",
  personController.postNewPerson,
  personController.updatePersonErrorHandler
);

// GET /person/:id/ - get person detail
router.get("/:id", routeValidator.validateIDParam, personController.getPerson);

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
