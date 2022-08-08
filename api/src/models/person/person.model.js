const { DEFAULT_PAGE_SIZE, PROJECTION } = require("../../configs/route.config");
const Person = require("./Person");

async function exists(name) {
  return (await Person.exists({ name: name })) != null;
}

// Admin
function addPerson(person) {
  return Person.create(person);
}

// Admin
function getPeople(
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
  sort = {},
  projection = PROJECTION.ADMIN.DEFAULT.USER
) {
  return Person.find({}, projection)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
}

// Both
function getPersonByID(id, projection) {
  return Person.findById(id, projection);
}

function getPersonByName(name) {
  return Person.findOne({ name: name });
}

// Admin
function updatePerson(id, updateData) {
  return Person.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
    projection: PROJECTION.ADMIN.DEFAULT.PERSON,
  });
}

// Admin
function deletePersonByID(id) {
  return Person.findByIdAndDelete(id, {
    projection: PROJECTION.ADMIN.DEFAULT.PERSON,
  });
}

// Stats
function getTotalPeople() {
  return Person.estimatedDocumentCount();
}

module.exports = {
  exists,
  addPerson,
  getPeople,
  getPersonByID,
  getPersonByName,
  updatePerson,
  deletePersonByID,
  getTotalPeople,
};
