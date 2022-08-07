const { default: mongoose } = require("mongoose");
const {
  DEFAULT_PAGE_SIZE,
  movieSortOptions,
  customProjection,
} = require("../../configs/route.config");
const Movie = require("./Movie");

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

async function getPaginatedMovies(
  filter = null,
  sort = null,
  page = 1,
  project = customProjection.ITEM_BASE_INFO
) {
  try {
    const [result] = await Movie.aggregate([
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
      totalPages: Math.ceil(totalDocs / DEFAULT_PAGE_SIZE),
      totalDocuments: totalDocs,
    };

    return output;
  } catch (error) {
    throw error;
  }
}

async function getMovies({
  genre = null,
  country = null,
  year = null,
  sort = movieSortOptions.releaseDate,
  page = 1,
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
    return await getPaginatedMovies(filter, sort, page);
  } catch (error) {
    throw error;
  }
}

async function getUpcomingMovies(page = 1) {
  try {
    const filter = { isUpcoming: true };
    const sort = { releaseDate: 1 };
    return await getPaginatedMovies(filter, sort, page);
  } catch (error) {
    throw error;
  }
}

async function getMoviesByTitle(query, page = 1) {
  try {
    const filter = { $text: { $search: query } };
    const sort = { score: { $meta: "textScore" } };
    return await getPaginatedMovies(filter, sort, page);
  } catch (error) {
    throw error;
  }
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
      { $project: customProjection.ITEM_BASE_INFO },
    ]);
    return similarMovies;
  } catch (error) {
    throw error;
  }
}

// Get Single Movie
function getMovieByID(id) {
  return Movie.findById(id, customProjection.ITEM_FULL_INFO)
    .populate("cast", customProjection.PERSON_BRIEF_INFO)
    .populate("directors", customProjection.PERSON_BRIEF_INFO);
}

function getMovieByTitle(title) {
  return Movie.findOne({ title: title });
}

function getRandomMovie() {
  return Movie.aggregate([
    { $match: { isUpcoming: false } },
    { $sample: { size: 1 } },
    { $project: customProjection.ITEM_BASE_INFO },
  ]);
}

// Update
function updateMovie(id, updateData) {
  return Movie.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
    projection: customProjection.ITEM_FULL_INFO,
  });
}

// Delete
function deleteMovieByID(id) {
  return Movie.findByIdAndDelete(id, {
    projection: customProjection.ITEM_FULL_INFO,
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
