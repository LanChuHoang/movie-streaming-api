const tmdbModel = require("./tmdb.model");
const fileModel = require("./file.model");
const Movie = require("../../models/movie/Movie");
const Show = require("../../models/show/Show");
const mongoService = require("../mongo.service");

const backendModel = {
  movie: Movie,
  show: Show,
};

async function updateTmdbIds(itemType = tmdbModel.itemType.movie) {
  const tmdbApi = tmdbModel[itemType];
  const backendApi = backendModel[itemType];
  const updateTmdbId = async ({ _id, title }) => {
    try {
      const matchedTmdb = await tmdbApi.searchItem(title);
      const updatedItem = await backendApi.findByIdAndUpdate(
        _id,
        { tmdbID: matchedTmdb.id },
        { projection: { title: 1, tmdbID: 1 }, returnDocument: "after" }
      );
      return updatedItem;
    } catch (error) {
      throw new Error(`${_id} - ${title} - ${error.message}`);
    }
  };

  const toUpdateItems = await backendApi.find({ tmdbID: null }, { title: 1 });
  const results = await Promise.allSettled(
    toUpdateItems.map((m) => updateTmdbId(m))
  );
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
  console.log(
    `Updated ${itemType}: ${successItems.length}, Failed ${errors.length}`
  );
}

async function update() {
  try {
    await mongoService.connect();
    await updateTmdbIds(tmdbModel.itemType.show);
  } catch (error) {
    console.log(error);
  } finally {
    await mongoService.disconnect();
  }
}

update();
