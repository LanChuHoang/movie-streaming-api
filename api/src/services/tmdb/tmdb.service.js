const tmdbModel = require("./models/tmdb/tmdb.model");
const logger = require("./models/logger/logger.model");
const Movie = require("../../models/movie/Movie");
const Show = require("../../models/show/Show");
const Person = require("../../models/person/Person");
const mongoService = require("../mongo.service");
const {
  toMovieModel,
  toShowModel,
  toPersonModel,
  isDirector,
} = require("./models/tmdb/tmdb.helper");

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

    await logger.writeErrors(errors);
    console.log(
      `Updated page ${page}: success ${updated.length}, failed ${errors.length}`
    );
  }
}

async function upsertPerson(tmdbPerson, type = "cast") {
  let storedPerson = await Person.findOne({ tmdbID: tmdbPerson.id });
  if (!storedPerson) {
    const tmdbPersonDetail = (await tmdbModel.person.getItem(tmdbPerson.id))
      .data;
    const mappedData = toPersonModel(tmdbPersonDetail);
    storedPerson = await Person.create(mappedData);
  }
  return type === "cast"
    ? { _id: storedPerson._id, character: tmdbPerson.character }
    : { _id: storedPerson._id };
}

async function updateCredits(itemType = tmdbModel.itemType.movie) {
  const mediaModel = backendModel[itemType];
  const tmdbApi = tmdbModel[itemType];

  const updateCredit = async ({ _id, tmdbID }) => {
    const tmdbCredits = (await tmdbApi.getCredits(tmdbID)).data;
    const [cast, directors] = await Promise.all([
      Promise.all(tmdbCredits.cast.map((p) => upsertPerson(p, "cast"))),
      Promise.all(
        tmdbCredits.crew
          .filter(isDirector)
          .map((p) => upsertPerson(p, "director"))
      ),
    ]);
    const updatedMedia = await mediaModel.findByIdAndUpdate(
      _id,
      {
        cast,
        directors,
      },
      {
        returnDocument: "after",
        projection: { title: 1 },
      }
    );
    return updatedMedia;
  };

  // const totalDocs = 1;
  const totalDocs = await mediaModel.estimatedDocumentCount();
  const pageSize = 10;
  const totalPages = Math.ceil(totalDocs / pageSize);

  for (let page = 0; page < totalPages; page++) {
    const backendMedia = await mediaModel
      .find({}, { tmdbID: 1 })
      .skip(page * pageSize)
      .limit(pageSize);
    const results = await Promise.allSettled(backendMedia.map(updateCredit));
    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results
      .filter((r) => r.status === "rejected")
      .flatMap(
        (r, i) =>
          `${backendMedia[i]._id} - ${backendMedia[i].tmdbID} - ${r.reason.message}`
      );
    await logger.writeErrors(rejected);
    console.log(
      `Updated ${itemType} credits page ${page}: success ${fulfilled.length}, errors ${rejected.length}`
    );
  }
}

async function update() {
  try {
    await mongoService.connect();
    // await updateCredits();
  } catch (error) {
    console.log(error);
  } finally {
    await mongoService.disconnect();
  }
}

update();
