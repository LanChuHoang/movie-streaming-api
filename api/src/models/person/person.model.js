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
            { $skip: DEFAULT_PAGE_SIZE * (page - 1) },
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

// Admin
function addPerson(person) {
  return Person.create(person);
}

// Admin
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

// Admin
function getPeopleByName(
  query,
  page,
  limit,
  projection = PROJECTION.ADMIN.DEFAULT.PERSON
) {
  const filter = { $text: { $search: query } };
  const sort = { score: { $meta: "textScore" } };
  return getPaginatedMovies(filter, sort, page, limit, projection);
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
  getPeopleByName,
  getPersonByID,
  getPersonByName,
  updatePerson,
  deletePersonByID,
  getTotalPeople,
};
