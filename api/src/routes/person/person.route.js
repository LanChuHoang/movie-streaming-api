const express = require("express");
const personController = require("./person.controller");

const router = express.Router();

// POST /person - post new person
router.post("/", personController.postNewPerson);

// GET /person/:id/ - get person detail
router.get("/:id", personController.getPerson);

// PATCH /person/:id - update person
router.patch("/:id", personController.updatePerson);

// DELETE /person/:id - delete person
router.delete("/:id", personController.deletePerson);

module.exports = router;
