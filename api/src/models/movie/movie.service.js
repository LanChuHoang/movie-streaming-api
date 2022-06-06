const { DEFAULT_PAGE_SIZE } = require("../../configs/route.config");
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
  sort = "releaseDate",
  page = 1,
}) {
  try {
    const filter = {};
    if (genre) filter.genres = { $all: [genre] };
    if (country) filter.countries = { $all: [country] };
    if (year)
      filter.releaseDate = { $gte: `${year}-1-1`, $lte: `${year}-12-31` };

    return await movieModel
      .find(filter)
      .sort(`-${sort}`)
      .skip(DEFAULT_PAGE_SIZE * (page - 1))
      .limit(DEFAULT_PAGE_SIZE);
  } catch (error) {
    throw error;
  }
}

async function getMovieByID(id) {
  try {
    return await movieModel.findById(id);
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
  getMovieByID,
  getMovieByTitle,
  getRandomMovie,
  getNumPages,
  updateMovie,
  deleteMovieByID,
};
