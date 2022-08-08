const { default: mongoose } = require("mongoose");
const { DEFAULT_PAGE_SIZE, PROJECTION } = require("../../configs/route.config");
const Show = require("./Show");

const DEFAULT_SORT_OPTION = { lastAirDate: -1 };

async function exists(title) {
  return (await Show.exists({ title: title })) !== null;
}

// Add
// ADMIN
function addShow(show) {
  return Show.create(show);
}

// Get Shows
function getAllShows() {
  return Show.find();
}

async function getPaginatedShows(filter = null, sort, page, limit, projection) {
  try {
    const [result] = await Show.aggregate([
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

// BOTH
async function getShows({
  genre = null,
  country = null,
  year = null,
  sort = DEFAULT_SORT_OPTION,
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
  projection = PROJECTION.USER.DEFAULT.SHOW,
}) {
  const filter = {};
  if (genre) filter.genres = { $all: [genre] };
  if (country) filter.countries = { $all: [country] };
  if (year)
    filter.lastAirDate = {
      $gte: new Date("2021-01-01"),
      $lte: new Date("2021-12-31"),
    };

  try {
    return await getPaginatedShows(filter, sort, page, limit, projection);
  } catch (error) {
    throw error;
  }
}

// BOTH
async function getShowsByTitle(
  query,
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
  projection
) {
  try {
    const filter = { $text: { $search: query } };
    const sort = { score: { $meta: "textScore" } };
    return await getPaginatedShows(filter, sort, page, limit, projection);
  } catch (error) {
    throw error;
  }
}

async function getSimilarShows(id) {
  try {
    const { genres } = await Show.findById(id, { genres: 1 });
    const projection = PROJECTION.CUSTOM.ITEM_BASE_INFO;
    projection.numSimilar = {
      $size: { $setIntersection: [genres, "$genres"] },
    };
    const similarShows = await Show.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(id) },
          genres: { $in: genres },
        },
      },
      { $project: projection },
      { $sort: { numSimilar: -1, lastAirDate: -1 } },
      { $limit: DEFAULT_PAGE_SIZE },
      { $project: { numSimilar: 0 } },
    ]);
    return similarShows;
  } catch (error) {
    throw error;
  }
}

// Get Single Shows
// BOTH
function getShowByID(id, projection) {
  return Show.findById(id, projection)
    .populate("cast", PROJECTION.CUSTOM.PERSON_BRIEF_INFO)
    .populate("directors", PROJECTION.CUSTOM.PERSON_BRIEF_INFO);
}

function getShowByTitle(title) {
  return Show.findOne({ title: title });
}

// USER
function getRandomShow() {
  return Show.aggregate([
    { $sample: { size: 1 } },
    { $project: PROJECTION.CUSTOM.ITEM_BASE_INFO },
  ]);
}

// Update
// ADMIN
function updateShow(id, updateData) {
  return Show.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
    projection: PROJECTION.ADMIN.DEFAULT.SHOW,
  });
}

// Delete
// ADMIN
function deleteShowByID(id) {
  return Show.findByIdAndDelete(id, {
    projection: PROJECTION.ADMIN.DEFAULT.SHOW,
  });
}

module.exports = {
  exists,
  addShow,
  getAllShows,
  getShows,
  getShowsByTitle,
  getSimilarShows,
  getShowByID,
  getShowByTitle,
  getRandomShow,
  updateShow,
  deleteShowByID,
};
