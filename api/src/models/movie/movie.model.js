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
// ADMIN
function addMovie(movie) {
  return Movie.create(movie);
}

// Get Movies
function getAllMovies() {
  return Movie.find();
}

// BOTH
async function getMovies({
  genre = null,
  country = null,
  year = null,
  sort = DEFAULT_SORT_OPTION,
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
  projection = PROJECTION.USER.DEFAULT.MOVIE,
}) {
  const filter = { isUpcoming: false };
  if (genre) filter.genres = { $all: [genre] };
  if (country) filter.countries = { $all: [country] };
  if (year)
    filter.releaseDate = {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`),
    };

  try {
    return await getPaginatedMovies(filter, sort, page, limit, projection);
  } catch (error) {
    throw error;
  }
}

// TODO:
async function getUpcomingMovies(
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
  projection
) {
  try {
    const filter = { isUpcoming: true };
    const sort = { releaseDate: 1 };
    return await getPaginatedMovies(filter, sort, page, limit, projection);
  } catch (error) {
    throw error;
  }
}

// BOTH
async function getMoviesByTitle(
  query,
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
  projection
) {
  try {
    const filter = { $text: { $search: query } };
    const sort = { score: { $meta: "textScore" } };
    return await getPaginatedMovies(filter, sort, page, limit, projection);
  } catch (error) {
    throw error;
  }
}

// USER
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

// Get Single Movie
// BOTH
function getMovieByID(id, projection) {
  return Movie.findById(id, projection)
    .populate("cast", PROJECTION.CUSTOM.PERSON_BRIEF_INFO)
    .populate("directors", PROJECTION.CUSTOM.PERSON_BRIEF_INFO);
}

// USER
function getRandomMovie() {
  return Movie.aggregate([
    { $match: { isUpcoming: false } },
    { $sample: { size: 1 } },
    { $project: PROJECTION.CUSTOM.ITEM_BASE_INFO },
  ]);
}

function getMovieByTitle(title) {
  return Movie.findOne({ title: title });
}

// Update
// ADMIN
function updateMovie(id, updateData) {
  return Movie.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
    projection: PROJECTION.ADMIN.DEFAULT.MOVIE,
  });
}

// Delete
// ADMIN
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
  getUpcomingMovies,
  getMoviesByTitle,
  getSimilarMovies,
  getMovieByID,
  getMovieByTitle,
  getRandomMovie,
  updateMovie,
  deleteMovieByID,
};
