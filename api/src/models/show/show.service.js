const { default: mongoose } = require("mongoose");
const {
  DEFAULT_PAGE_SIZE,
  showSortOptions,
  customProjection,
} = require("../../configs/route.config");
const showModel = require("./show.model");

async function exists(title) {
  return (await showModel.exists({ title: title })) !== null;
}

// Add
function addShow(show) {
  return showModel.create(show);
}

// Get Shows
function getAllShows() {
  return showModel.find();
}

async function getPaginatedShows(
  filter = null,
  sort = null,
  page = 1,
  project = customProjection.ITEM_BASE_INFO
) {
  try {
    const [result] = await showModel.aggregate([
      { $match: filter },
      {
        $facet: {
          docs: [
            { $sort: sort },
            { $skip: DEFAULT_PAGE_SIZE * (page - 1) },
            { $limit: DEFAULT_PAGE_SIZE },
            { $project: project },
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
      pageSize: DEFAULT_PAGE_SIZE,
      total_pages: Math.ceil(totalDocs / DEFAULT_PAGE_SIZE),
      total_documents: totalDocs,
    };

    return output;
  } catch (error) {
    throw error;
  }
}

async function getShows({
  genre = null,
  country = null,
  year = null,
  sort = showSortOptions.lastAirDate,
  page = 1,
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
    return await getPaginatedShows(filter, sort, page);
  } catch (error) {
    throw error;
  }
}

async function getShowsByTitle(query, page = 1) {
  try {
    const filter = { $text: { $search: query } };
    const sort = { score: { $meta: "textScore" } };
    return await getPaginatedShows(filter, sort, page);
  } catch (error) {
    throw error;
  }
}

async function getSimilarShows(id) {
  try {
    const { genres } = await showModel.findById(id, { genres: 1 });
    const projection = customProjection.ITEM_BASE_INFO;
    projection.numSimilar = {
      $size: { $setIntersection: [genres, "$genres"] },
    };
    const similarShows = await showModel.aggregate([
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
function getShowByID(id) {
  return showModel
    .findById(id, customProjection.ITEM_FULL_INFO)
    .populate("cast", customProjection.PERSON_BRIEF_INFO)
    .populate("directors", customProjection.PERSON_BRIEF_INFO);
}

function getShowByTitle(title) {
  return showModel.findOne({ title: title });
}

function getRandomShow() {
  return showModel.aggregate([
    { $sample: { size: 1 } },
    { $project: customProjection.ITEM_BASE_INFO },
  ]);
}

// Update
function updateShow(id, updateData) {
  return showModel.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
    projection: customProjection.ITEM_FULL_INFO,
  });
}

// Delete
function deleteShowByID(id) {
  return showModel.findByIdAndDelete(id, {
    projection: customProjection.ITEM_FULL_INFO,
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
