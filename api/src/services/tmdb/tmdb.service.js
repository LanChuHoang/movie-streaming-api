const tmdbModel = require("./tmdb.model");
const fileModel = require("./file.model");
const Movie = require("../../models/movie/Movie");
const mongoService = require("../mongo.service");

async function updateTmdbIds() {
  const tmdbApi = tmdbModel.movie;
  const updateTmdbId = async ({ _id, title }) => {
    try {
      const matchedItem = await tmdbApi.findMatchingItem(title);
      const updatedMovie = await Movie.findByIdAndUpdate(
        _id,
        { tmdbID: matchedItem.id },
        { projection: { title: 1, tmdbID: 1 }, returnDocument: "after" }
      );
      return updatedMovie;
    } catch (error) {
      throw new Error(`${_id} - ${title} - ${error.message}`);
    }
  };

  const movies = await Movie.find({ tmdbID: null }, { title: 1 });
  const results = await Promise.allSettled(movies.map((m) => updateTmdbId(m)));
  const successItems = results
    .filter((r) => r.status === "fulfilled")
    .map(({ value }) => `${value._id} - ${value.tmdbID} - ${value.title}`);
  const errors = results
    .filter((r) => r.status === "rejected")
    .map(({ reason }) => reason.message);
  await Promise.all([
    fileModel.writeSuccess(successItems),
    fileModel.writeErrors(errors),
  ]);
  console.log(`Updated ${successItems.length}, Failed ${errors.length}`);
}

async function update() {
  try {
    await mongoService.connect();
    await updateTmdbIds();
  } catch (error) {
    console.log(error);
  } finally {
    await mongoService.disconnect();
  }
}

update();
