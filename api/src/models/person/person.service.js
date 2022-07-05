const personModel = require("./person.model");

async function exists(name) {
  return (await personModel.exists({ name: name })) != null;
}

function addPerson(person) {
  return personModel.create(person);
}

function getPersonByID(id) {
  return personModel.findById(id);
}

function getPersonByName(name) {
  return personModel.findOne({ name: name });
}

function updatePerson(id, updateData) {
  return personModel.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
  });
}

function deletePersonByID(id) {
  return personModel.findByIdAndDelete(id);
}

module.exports = {
  exists,
  addPerson,
  getPersonByID,
  getPersonByName,
  updatePerson,
  deletePersonByID,
};
