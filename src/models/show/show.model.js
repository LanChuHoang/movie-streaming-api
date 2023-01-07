const { default: mongoose, Mongoose } = require("mongoose");
const { DEFAULT_PAGE_SIZE, PROJECTION } = require("../../configs/route.config");
const Show = require("./Show");

const DEFAULT_SORT_OPTION = { lastAirDate: -1 };

async function getPaginatedShows(filter = null, sort, page, limit, projection) {
  try {
    const [result] = await Show.aggregate([
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

const setSeasonField = (field, value) => ({
  $set: {
    seasons: {
      $map: {
        input: "$seasons",
        in: {
          $setField: {
            field,
            input: "$$this",
            value,
          },
        },
      },
    },
  },
});

async function exists(title) {
  return (await Show.exists({ title: title })) !== null;
}

// Add
function addShow(show) {
  return Show.create(show);
}

// Get Shows
function getAllShows() {
  return Show.find();
}

function getShows({
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
  return getPaginatedShows(filter, sort, page, limit, projection);
}

function getShowsByTitle({
  query,
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
  projection,
}) {
  const filter = { $text: { $search: query } };
  const sort = { score: { $meta: "textScore" } };
  return getPaginatedShows(filter, sort, page, limit, projection);
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

// Get Single Show
async function getShowByID(id, projection) {
  const [show] = await Show.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    setSeasonField("episodeCount", { $size: "$$this.episodes" }),
    setSeasonField("episodeRuntime", { $avg: "$$this.episodes.runtime" }),
    {
      $project: {
        ...projection,
        "seasons.episodes": 0,
        cast: 0,
        directors: 0,
        seasons: { ...projection },
      },
    },
  ]);
  return show;
}

function getShowByTitle(title) {
  return Show.findOne({ title: title });
}

async function getSeasons(showId) {
  const { seasons } = await Show.findById(showId, { seasons: 1 });
  return seasons;
}

async function getSeason(showId, seasonNumber) {
  const {
    seasons: [season],
  } = await Show.findById(showId, {
    seasons: { $elemMatch: { seasonNumber } },
  });
  return season;
}

async function getEpisode(showId, seasonNumber, episodeNumber) {
  const [response] = await Show.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(showId) },
    },
    {
      $project: {
        season: {
          $first: {
            $filter: {
              input: "$seasons",
              as: "season",
              cond: { $eq: ["$$season.seasonNumber", seasonNumber] },
            },
          },
        },
      },
    },
    {
      $project: {
        episode: {
          $first: {
            $filter: {
              input: "$season.episodes",
              as: "episode",
              cond: { $eq: ["$$episode.episodeNumber", episodeNumber] },
            },
          },
        },
      },
    },
  ]);
  return response?.episode;
}

async function getCredits(showId) {
  const docs = (
    await Show.findById(showId, { cast: 1, directors: 1, _id: 0 })
      .populate("cast._id", { name: 1, avatarUrl: 1 })
      .populate("directors", { name: 1, avatarUrl: 1 })
  ).toObject();
  return { ...docs, cast: docs.cast.map((p) => ({ ...p, ...p._id })) };
}

async function getJoinedShows(personId) {
  const [cast, director] = await Promise.all([
    Show.find(
      { "cast._id": personId },
      PROJECTION.CUSTOM.MEDIA_BRIEF_INFO
    ).sort({ lastAirDate: -1 }),
    Show.find({ directors: personId }, PROJECTION.CUSTOM.MEDIA_BRIEF_INFO).sort(
      { lastAirDate: -1 }
    ),
  ]);
  return { cast, director };
}

function getRandomShow() {
  return Show.aggregate([
    { $sample: { size: 1 } },
    { $project: PROJECTION.CUSTOM.ITEM_BASE_INFO },
  ]);
}

// Update
function updateShow(id, updateData) {
  return Show.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
    projection: PROJECTION.ADMIN.DEFAULT.SHOW,
  });
}

// Delete
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
  getSeasons,
  getSeason,
  getEpisode,
  getCredits,
  getJoinedShows,
  getRandomShow,
  updateShow,
  deleteShowByID,
};