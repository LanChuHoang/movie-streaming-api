const { DEFAULT_PAGE_SIZE } = require("../../configs/route.config");
const Person = require("./Person");

async function exists(name) {
  return (await Person.exists({ name: name })) != null;
}

function addPerson(person) {
  return Person.create(person);
}

function getPeople(page = 1, limit = DEFAULT_PAGE_SIZE, sort = {}) {
  return Person.find()
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
}

function getPersonByID(id) {
  return Person.findById(id);
}

function getPersonByName(name) {
  return Person.findOne({ name: name });
}

function updatePerson(id, updateData) {
  return Person.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
  });
}

function deletePersonByID(id) {
  return Person.findByIdAndDelete(id);
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
