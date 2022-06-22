const { default: mongoose } = require("mongoose");
const {
  DEFAULT_PAGE_SIZE,
  movieSortOptions,
  customProjection,
} = require("../../configs/route.config");
const movieModel = require("./movie.model");

async function exists(title) {
  return (await movieModel.exists({ title: title })) !== null;
}

// Add // TODO
async function addMovie(movie) {
  try {
    const createdMovie = await movieModel.create(movie);
    return createdMovie;
  } catch (error) {
    throw error;
  }
}

// Get Movies
async function getAllMovies() {
  try {
    return await movieModel.find();
  } catch (error) {
    throw error;
  }
}

async function getPaginatedMovies(
  filter = null,
  sort = null,
  page = 1,
  project = customProjection.ITEM_BASE_INFO
) {
  try {
    const [result] = await movieModel.aggregate([
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
    const { genres } = await movieModel.findById(id, { genres: 1 });
    // const projection = customProjection.ITEM_BASE_INFO;
    // projection.numSimilar = {
    //   $size: { $setIntersection: [genres, "$genres"] },
    // };
    const similarMovies = await movieModel.aggregate([
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
async function getMovieByID(id) {
  try {
    return await movieModel
      .findById(id, customProjection.ITEM_FULL_INFO)
      .populate("cast", customProjection.PERSON_BRIEF_INFO)
      .populate("directors", customProjection.PERSON_BRIEF_INFO);
  } catch (error) {
    throw error;
  }
}

async function getMovieByTitle(title) {
  try {
    return await movieModel.findOne({ title: title });
  } catch (error) {
    throw error;
  }
}

async function getRandomMovie() {
  try {
    return await movieModel.aggregate([
      { $match: { isUpcoming: false } },
      { $sample: { size: 1 } },
      { $project: customProjection.ITEM_BASE_INFO },
    ]);
  } catch (error) {
    throw error;
  }
}

// Update //TODO
async function updateMovie(id, updateData) {
  try {
    return await movieModel.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
      projection: customProjection.ITEM_FULL_INFO,
    });
  } catch (error) {
    throw error;
  }
}

// Delete //TODO
async function deleteMovieByID(id) {
  try {
    return await movieModel.findByIdAndDelete(id, {
      projection: customProjection.ITEM_FULL_INFO,
    });
  } catch (error) {
    throw error;
  }
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
