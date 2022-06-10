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
async function addShow(show) {
  try {
    const createdShow = await showModel.create(show);
    return createdShow;
  } catch (error) {
    throw error;
  }
}

// Get Shows
async function getAllShows() {
  try {
    return await showModel.find();
  } catch (error) {
    throw error;
  }
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

    const output = {
      docs: result.docs,
      page: page,
      pageSize: DEFAULT_PAGE_SIZE,
      total_pages: Math.ceil(result.meta.total_documents / DEFAULT_PAGE_SIZE),
      total_documents: result.meta.total_documents,
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

// Get Single Shows
async function getShowByID(id) {
  try {
    return await showModel.findById(id, customProjection.ITEM_FULL_INFO);
  } catch (error) {
    throw error;
  }
}

async function getShowByTitle(title) {
  try {
    return await showModel.findOne({ title: title });
  } catch (error) {
    throw error;
  }
}

async function getRandomShow() {
  try {
    return await showModel.aggregate([
      { $sample: { size: 1 } },
      { $project: customProjection.ITEM_BASE_INFO },
    ]);
  } catch (error) {
    throw error;
  }
}

// Update
async function updateShow(id, updateData) {
  try {
    return await showModel.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
      projection: customProjection.ITEM_FULL_INFO,
    });
  } catch (error) {
    throw error;
  }
}

// Delete
async function deleteShowByID(id) {
  try {
    return await showModel.findByIdAndDelete(id, {
      projection: customProjection.ITEM_FULL_INFO,
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  exists,
  addShow,
  getAllShows,
  getShows,
  getShowsByTitle,
  getShowByID,
  getShowByTitle,
  getRandomShow,
  updateShow,
  deleteShowByID,
};
