const {
  DEFAULT_PAGE_SIZE,
  movieSortOptions,
} = require("../../configs/route.config");
const movieModel = require("./movie.model");

async function exists(title) {
  return (await movieModel.exists({ title: title })) !== null;
}

async function addMovie(movie) {
  try {
    const createdMovie = await movieModel.create(movie);
    return createdMovie;
  } catch (error) {
    throw error;
  }
}

async function getAllMovies() {
  try {
    return await movieModel.find();
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
      $gte: new Date("2021-01-01"),
      $lte: new Date("2021-12-31"),
    };

  try {
    const [
      {
        meta: { total_documents },
        docs,
      },
    ] = await movieModel.aggregate([
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

async function getUpcomingMovies(page = 1) {
  try {
    const movies = await movieModel
      .find({ isUpcoming: true })
      .sort("releaseDate")
      .skip(DEFAULT_PAGE_SIZE * (page - 1))
      .limit(DEFAULT_PAGE_SIZE);
    return movies;
  } catch (error) {}
}

async function getMoviesByTitle(query, page = 1) {
  try {
    const [
      {
        meta: { total_documents },
        docs,
      },
    ] = await movieModel.aggregate([
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

async function getMovieByID(id) {
  try {
    return await movieModel
      .findById(id)
      .populate("cast", "_id name avatarUrl")
      .populate("directors", "_id name avatarUrl");
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
      {
        $sample: { size: 1 },
      },
    ]);
  } catch (error) {}
}

async function getNumPages() {
  return Math.ceil(
    (await movieModel.estimatedDocumentCount()) / DEFAULT_PAGE_SIZE
  );
}

async function getUpcomingNumPages() {
  return Math.ceil(
    (await movieModel.find({ isUpcoming: true }).count()) / DEFAULT_PAGE_SIZE
  );
}

async function updateMovie(id, updateData) {
  try {
    return await movieModel.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });
  } catch (error) {
    throw error;
  }
}

async function deleteMovieByID(id) {
  try {
    return await movieModel.findByIdAndDelete(id);
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
  getMovieByID,
  getMovieByTitle,
  getRandomMovie,
  getNumPages,
  getUpcomingNumPages,
  updateMovie,
  deleteMovieByID,
};
