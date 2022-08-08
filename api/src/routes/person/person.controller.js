const mongoose = require("mongoose");
const {
  errorResponse,
  DEFAULT_PAGE_SIZE,
} = require("../../configs/route.config");
const personModel = require("../../models/person/person.model");

// POST /person - post new person
async function postNewPerson(req, res, next) {
  try {
    const createdPerson = await personModel.addPerson(req.body);
    return res.status(201).json(createdPerson);
  } catch (error) {
    next(error);
  }
}

// GET /person?page&limit&sort
async function getPeople(req, res, next) {
  try {
    const { page, limit, sort, projection } = req.query;
    const [people, totalPeople] = await Promise.all([
      personModel.getPeople(page, limit, sort, projection),
      personModel.getTotalPeople(),
    ]);
    const pageSize = limit || DEFAULT_PAGE_SIZE;
    const response = {
      docs: people,
      page: page || 1,
      pageSize,
      totalPages: Math.ceil(totalPeople / pageSize),
      totalDocuments: totalPeople,
      sort,
    };
    return res.send(response);
  } catch (error) {
    next(error);
  }
}

// GET /person/:id/ - get person detail
async function getPerson(req, res, next) {
  try {
    const person = await personModel.getPersonByID(req.params.id);
    if (!person) return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(person);
  } catch (error) {
    next(error);
  }
}

// PATCH /person/:id - update person
async function updatePerson(req, res, next) {
  try {
    const person = await personModel.updatePerson(req.params.id, req.body);
    if (!person) return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(person);
  } catch (error) {
    next(error);
  }
}

// DELETE /person/:id - delete person
async function deletePerson(req, res, next) {
  try {
    const person = await personModel.deletePersonByID(req.params.id);
    if (!person) return res.status(404).json(errorResponse.DEFAULT_404_ERROR);
    return res.status(200).json(person);
  } catch (error) {
    next(error);
  }
}

function updatePersonErrorHandler(error, req, res, next) {
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

module.exports = {
  postNewPerson,
  getPeople,
  getPerson,
  updatePerson,
  deletePerson,
  updatePersonErrorHandler,
};
