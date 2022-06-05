const personModel = require("./person.model");

async function addPerson(person) {
  try {
    const createdPerson = await personModel.create(person);
    return createdPerson;
  } catch (error) {
    throw error;
  }
}

async function getPersonByID(id) {
  try {
    return await personModel.findById(id);
  } catch (error) {
    throw error;
  }
}

async function updatePerson(id, updateData) {
  try {
    return await personModel.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });
  } catch (error) {
    throw error;
  }
}

async function deletePersonByID(id) {
  try {
    return await personModel.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addPerson,
  getPersonByID,
  updatePerson,
  deletePersonByID,
};
