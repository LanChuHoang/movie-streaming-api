const personModel = require("./person.model");

async function exists(name) {
  return (await personModel.exists({ name: name })) != null;
}

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

async function getPersonByName(name) {
  try {
    return await personModel.findOne({ name: name });
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
  exists,
  addPerson,
  getPersonByID,
  getPersonByName,
  updatePerson,
  deletePersonByID,
};
