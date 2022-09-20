const tmdbModel = require("./tmdb.model");
const fileModel = require("./file.model");
const Movie = require("../../models/movie/Movie");
const Show = require("../../models/show/Show");
const Person = require("../../models/person/Person");
const mongoService = require("../mongo.service");
const { toMovieModel, toShowModel } = require("./tmdb.helper");

const backendModel = {
  movie: Movie,
  show: Show,
  person: Person,
};

const toModel = {
  movie: toMovieModel,
  show: toShowModel,
};

async function updateMediaBasicInfo(itemType = tmdbModel.itemType.movie) {
  const mediaModel = backendModel[itemType];
  const tmdbApi = tmdbModel[itemType];
  const mapToModel = toModel[itemType];

  const updateItem = async (toUpdateItem) => {
    const tmdbItem = (await tmdbApi.getItem(toUpdateItem.tmdbID)).data;
    const mappedData = mapToModel(tmdbItem);
    return mediaModel.findByIdAndUpdate(toUpdateItem._id, mappedData, {
      projection: { title: 1, tmdbID: 1 },
      returnDocument: "after",
    });
  };

  const totalDocs = await mediaModel.estimatedDocumentCount();
  const pageSize = 100;
  const totalPages = Math.ceil(totalDocs / pageSize);

  for (let page = 0; page < totalPages; page++) {
    const toUpdateMedia = await mediaModel
      .find({}, { tmdbID: 1 })
      .skip(page * pageSize)
      .limit(pageSize);

    const results = await Promise.allSettled(toUpdateMedia.map(updateItem));
    const updated = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);
    const errors = results
      .filter((r) => r.status === "rejected")
      .map((r) => r.reason.message);

    await fileModel.writeErrors(errors);
    console.log(
      `Updated page ${page}: success ${updated.length}, failed ${errors.length}`
    );
  }
}

async function update() {
  try {
    await mongoService.connect();
    await updateMediaBasicInfo(tmdbModel.itemType.show);
  } catch (error) {
    console.log(error);
  } finally {
    await mongoService.disconnect();
  }
}

update();
