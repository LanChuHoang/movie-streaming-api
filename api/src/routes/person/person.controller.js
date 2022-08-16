const mongoose = require("mongoose");
const {
  errorResponse,
  DEFAULT_PAGE_SIZE,
} = require("../../configs/route.config");
const personModel = require("../../models/person/person.model");

async function postNewPerson(req, res, next) {
  try {
    const createdPerson = await personModel.addPerson(req.body);
    return res.status(201).send(createdPerson);
  } catch (error) {
    next(error);
  }
}

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

async function searchPeople(req, res, next) {
  try {
    const { query, page, limit, projection } = req.query;
    const response = await personModel.getPeopleByName(
      query,
      page,
      limit,
      projection
    );
    return res.send(response);
  } catch (error) {
    next(error);
  }
}

async function getPerson(req, res, next) {
  try {
    const person = await personModel.getPersonByID(
      req.params.id,
      req.query.defaultProjection
    );
    if (!person) return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    return res.send(person);
  } catch (error) {
    next(error);
  }
}

async function updatePerson(req, res, next) {
  try {
    const person = await personModel.updatePerson(req.params.id, req.body);
    if (!person) return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    return res.send(person);
  } catch (error) {
    next(error);
  }
}

async function deletePerson(req, res, next) {
  try {
    const person = await personModel.deletePersonByID(req.params.id);
    if (!person) return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    return res.send(person);
  } catch (error) {
    next(error);
  }
}

function updatePersonErrorHandler(error, req, res, next) {
  console.log(error);
  if (error.errors?.gender?.kind === "enum") {
    return res.status(400).send(errorResponse.INVALID_GENDER);
  }
  if (error.errors?.job?.kind === "enum") {
    return res.status(400).send(errorResponse.INVALID_JOB);
  }
  if (
    error instanceof mongoose.Error.CastError ||
    (error.errors &&
      Object.values(error.errors)[0] instanceof mongoose.Error.CastError)
  ) {
    return res.status(400).send(errorResponse.INVALID_QUERY);
  }
  next(error);
}

module.exports = {
  postNewPerson,
  getPeople,
  searchPeople,
  getPerson,
  updatePerson,
  deletePerson,
  updatePersonErrorHandler,
};
