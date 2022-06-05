const mongoose = require("mongoose");
const { errorResponse } = require("../../configs/route.config");
const personService = require("../../models/person/person.service");

function updatePersonErrorHandler(error, req, res) {
  console.log(error);
  if (error.errors?.gender?.kind === "enum") {
    return res.status(400).json({ error: "Invalid gender" });
  }
  if (error.errors?.job?.kind === "enum") {
    return res.status(400).json({ error: "Invalid job" });
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

// POST /person - post new person
async function postNewPerson(req, res) {
  try {
    const createdPerson = await personService.addPerson(req.body);
    return res.status(201).json(createdPerson);
  } catch (error) {
    updatePersonErrorHandler(error, req, res);
  }
}

// GET /person/:id/ - get person detail
async function getPerson(req, res) {
  try {
    const person = await personService.getPersonByID(req.params.id);
    if (!person) return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(person);
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse.DEFAULT_500_ERROR);
  }
}

// PATCH /person/:id - update person
async function updatePerson(req, res) {
  try {
    const person = await personService.updatePerson(req.params.id, req.body);
    if (!person) return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(person);
  } catch (error) {
    updatePersonErrorHandler(error, req, res);
  }
}

// DELETE /person/:id - delete person
async function deletePerson(req, res) {
  try {
    const person = await personService.deletePersonByID(req.params.id);
    if (!person) return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(person);
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse.DEFAULT_500_ERROR);
  }
}

module.exports = {
  postNewPerson,
  getPerson,
  updatePerson,
  deletePerson,
};