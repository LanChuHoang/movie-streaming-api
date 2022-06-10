const {
  DEFAULT_PAGE_SIZE,
  showSortOptions,
} = require("../../configs/route.config");
const showModel = require("./show.model");

async function exists(title) {
  return (await showModel.exists({ title: title })) !== null;
}

async function addShow(show) {
  try {
    const createdShow = await showModel.create(show);
    return createdShow;
  } catch (error) {
    throw error;
  }
}

async function getAllShows() {
  try {
    return await showModel.find();
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
    const [
      {
        meta: { total_documents },
        docs,
      },
    ] = await showModel.aggregate([
      { $match: filter },
      {
        $facet: {
          docs: [
            { $sort: sort },
            { $skip: DEFAULT_PAGE_SIZE * (page - 1) },
            { $limit: DEFAULT_PAGE_SIZE },
          ],
          meta: [{ $count: "total_documents" }],
        },
      },
      { $unwind: "$meta" },
    ]);
    return { docs, total_documents };
  } catch (error) {
    throw error;
  }
}

async function getShowsByTitle(query, page = 1) {
  try {
    const [
      {
        meta: { total_documents },
        docs,
      },
    ] = await showModel.aggregate([
      { $match: { $text: { $search: query } } },
      {
        $facet: {
          docs: [
            { $sort: { score: { $meta: "textScore" } } },
            { $skip: DEFAULT_PAGE_SIZE * (page - 1) },
            { $limit: DEFAULT_PAGE_SIZE },
          ],
          meta: [{ $count: "total_documents" }],
        },
      },
      { $unwind: "$meta" },
    ]);
    return { docs, total_documents };
  } catch (error) {
    throw error;
  }
}

async function getShowByID(id) {
  try {
    return await showModel.findById(id);
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
      {
        $sample: { size: 1 },
      },
    ]);
  } catch (error) {}
}

async function getNumPages() {
  return Math.ceil(
    (await showModel.estimatedDocumentCount()) / DEFAULT_PAGE_SIZE
  );
}

async function updateShow(id, updateData) {
  try {
    return await showModel.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });
  } catch (error) {
    throw error;
  }
}

async function deleteShowByID(id) {
  try {
    return await showModel.findByIdAndDelete(id);
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
  getNumPages,
  updateShow,
  deleteShowByID,
};
