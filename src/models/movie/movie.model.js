const { default: mongoose } = require("mongoose");
const { DEFAULT_PAGE_SIZE, PROJECTION } = require("../../configs/route.config");
const Movie = require("./Movie");

const DEFAULT_SORT_OPTION = { releaseDate: -1 };

async function getPaginatedMovies(
  filter = null,
  sort,
  page,
  limit,
  projection
) {
  try {
    const [result] = await Movie.aggregate([
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

async function exists(title) {
  return (await Movie.exists({ title: title })) !== null;
}

// Add
function addMovie(movie) {
  return Movie.create(movie);
}

// Get Movies
function getAllMovies() {
  return Movie.find();
}

function getMovies({
  genre = null,
  country = null,
  year = null,
  isUpcoming,
  sort = DEFAULT_SORT_OPTION,
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
  projection = PROJECTION.USER.DEFAULT.MOVIE,
}) {
  const filter = {};
  if (genre) filter.genres = { $all: [genre] };
  if (country) filter.countries = { $all: [country] };
  if (year)
    filter.releaseDate = {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`),
    };
  if (typeof isUpcoming === "boolean") filter.isUpcoming = isUpcoming;
  return getPaginatedMovies(filter, sort, page, limit, projection);
}

function getMoviesByTitle({
  query,
  isUpcoming = false,
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
  projection,
}) {
  const filter = { $text: { $search: query }, isUpcoming };
  const sort = { score: { $meta: "textScore" } };
  return getPaginatedMovies(filter, sort, page, limit, projection);
}

async function getSimilarMovies(id) {
  try {
    const { genres } = await Movie.findById(id, { genres: 1 });
    const similarMovies = await Movie.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(id) },
          isUpcoming: false,
          genres: { $in: genres },
        },
      },
      {
        $addFields: {
          numSimilar: {
            $size: { $setIntersection: [genres, "$genres"] },
          },
        },
      },
      { $sort: { numSimilar: -1, releaseDate: -1 } },
      { $limit: DEFAULT_PAGE_SIZE },
      { $project: PROJECTION.CUSTOM.ITEM_BASE_INFO },
    ]);
    return similarMovies;
  } catch (error) {
    throw error;
  }
}

function getRandomMovies(limit = 1) {
  return Movie.aggregate([
    { $match: { isUpcoming: false } },
    { $sample: { size: limit } },
    { $project: PROJECTION.CUSTOM.ITEM_BASE_INFO },
  ]);
}

// Get Single Movie
function getMovieByID(id, projection) {
  return Movie.findById(id, { ...projection, cast: 0, directors: 0 });
}

function getMovieByTitle(title) {
  return Movie.findOne({ title: title });
}

async function getCredits(movieId) {
  const docs = (
    await Movie.findById(movieId, { cast: 1, directors: 1, _id: 0 })
      .populate("cast._id", { name: 1, avatarUrl: 1 })
      .populate("directors", { name: 1, avatarUrl: 1 })
  ).toObject();
  return { ...docs, cast: docs.cast.map((p) => ({ ...p, ...p._id })) };
}

async function getJoinedMovies(personId) {
  const [cast, director] = await Promise.all([
    Movie.find(
      { "cast._id": personId },
      PROJECTION.CUSTOM.MEDIA_BRIEF_INFO
    ).sort({ releaseDate: -1 }),
    Movie.find(
      { directors: personId },
      PROJECTION.CUSTOM.MEDIA_BRIEF_INFO
    ).sort({ releaseDate: -1 }),
  ]);
  return { cast, director };
}

// Update
function updateMovie(id, updateData) {
  return Movie.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
    projection: PROJECTION.ADMIN.DEFAULT.MOVIE,
  });
}

// Delete
function deleteMovieByID(id) {
  return Movie.findByIdAndDelete(id, {
    projection: PROJECTION.ADMIN.DEFAULT.MOVIE,
  });
}

module.exports = {
  exists,
  addMovie,
  getAllMovies,
  getMovies,
  getMoviesByTitle,
  getSimilarMovies,
  getRandomMovies,
  getMovieByID,
  getMovieByTitle,
  getCredits,
  getJoinedMovies,
  updateMovie,
  deleteMovieByID,
};