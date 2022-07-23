const Person = require("./Person");

async function exists(name) {
  return (await Person.exists({ name: name })) != null;
}

function addPerson(person) {
  return Person.create(person);
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

module.exports = {
  exists,
  addPerson,
  getPersonByID,
  getPersonByName,
  updatePerson,
  deletePersonByID,
};
