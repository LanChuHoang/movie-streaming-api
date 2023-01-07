const { DEFAULT_PAGE_SIZE, PROJECTION } = require("../../configs/route.config");
const Person = require("./Person");

async function getPaginatedPeople(
  filter = null,
  sort,
  page,
  limit,
  projection
) {
  try {
    const [result] = await Person.aggregate([
      { $match: filter },
      {
        $facet: {
          docs: [
            { $sort: sort },
            { $skip: limit * (page - 1) },
            { $limit: limit },
            { $project: projection },
          ],
          meta: [{ $count: "total_documents" }],
        },
      },
      { $unwind: "$meta" },
    ]);

    const totalDocs = result?.meta.total_documents || 0;
    const output = {
      docs: result?.docs || [],
      page: page,
      pageSize: limit,
      totalPages: Math.ceil(totalDocs / limit),
      totalDocuments: totalDocs,
    };

    return output;
  } catch (error) {
    throw error;
  }
}

async function exists(name) {
  return (await Person.exists({ name: name })) != null;
}

function addPerson(person) {
  return Person.create(person);
}

function getPeople(
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
  sort = {},
  projection = PROJECTION.ADMIN.DEFAULT.PERSON
) {
  return Person.find({}, projection)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
}

function getPeopleByName(
  query,
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
  projection = PROJECTION.ADMIN.DEFAULT.PERSON
) {
  const filter = { $text: { $search: query } };
  const sort = { score: { $meta: "textScore" }, name: 1 };
  return getPaginatedPeople(filter, sort, page, limit, projection);
}

function getPersonByID(id, projection) {
  return Person.findById(id, projection);
}

function getPersonByName(name) {
  return Person.findOne({ name: name });
}

function updatePerson(id, updateData) {
  return Person.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
    projection: PROJECTION.ADMIN.DEFAULT.PERSON,
  });
}

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
  getPeopleByName,
  getPersonByID,
  getPersonByName,
  updatePerson,
  deletePersonByID,
  getTotalPeople,
};
