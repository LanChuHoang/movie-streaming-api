const Movie = require("../../../../models/movie/Movie");
const Person = require("../../../../models/person/Person");
const Show = require("../../../../models/show/Show");
const logger = require("../logger/logger.model");
const tmdbModel = require("../tmdb/tmdb.model");
const {
  toMovieModel,
  toShowModel,
  toPersonModel,
  isDirector,
  isTrailer,
  toSeasonModel,
} = require("../tmdb/tmdb.helper");

class BackendBaseApi {
  constructor(model, tmdbApi, toBackendModel) {
    this.model = model;
    this.tmdbApi = tmdbApi;
    this.toBackendModel = toBackendModel;
  }

  getTmdbId = async (_id) => {
    const { tmdbID } = await this.model.findById(_id, { tmdbID: 1 });
    if (!tmdbID) throw new Error(`Not found tmdb id`);
    return tmdbID;
  };

  updateBaseData = async (_id, tmdbID) => {
    const tmdbId = tmdbID ? tmdbID : await this.getTmdbId(_id);
    const tmdbModel = (await this.tmdbApi.getItem(tmdbId)).data;
    const backendModel = this.toBackendModel(tmdbModel);
    const updatedItem = await this.model.findByIdAndUpdate(_id, backendModel, {
      projection: { title: 1, tmdbID: 1 },
      returnDocument: "after",
    });
    return updatedItem;
  };

  updateMany = async ({ pageSize = 100, limit, updateCallback }) => {
    const totalDocs = limit ? limit : await this.model.estimatedDocumentCount();
    const totalPages = Math.ceil(totalDocs / pageSize);

    for (let page = 0; page < totalPages; page++) {
      const toUpdateItem = await this.model
        .find({}, { tmdbID: 1 })
        .skip(page * pageSize)
        .limit(pageSize);
      const results = await Promise.allSettled(
        toUpdateItem.map((item) => updateCallback(item._id, item.tmdbID))
      );
      const updated = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);
      const errors = results
        .filter((r) => r.status === "rejected")
        .map(
          (r, i) =>
            `${toUpdateItem[i]._id} - ${toUpdateItem[i].tmdbID} - ${r.reason.message}`
        );
      await logger.writeErrors(errors);
      console.log(
        `Updated page ${page}: success ${updated.length}, failed ${errors.length}`
      );
    }
  };
}

class BackendMediaApi extends BackendBaseApi {
  updateTrailers = async (_id, tmdbID) => {
    const tmdbId = tmdbID ? tmdbID : await this.getTmdbId(_id);
    const tmdbVideos = await this.tmdbApi.getVideos(tmdbId);
    const trailers = tmdbVideos.filter(isTrailer).map((v) => v.key);
    return this.model.findByIdAndUpdate(
      _id,
      { trailers },
      { returnDocument: "after", projection: { title: 1 } }
    );
  };

  mapCreditData = async ({ id, character }, type = "cast") => {
    let storedPerson = await Person.findOne({ tmdbID: id });
    if (!storedPerson) {
      const tmdbPersonDetail = (await tmdbModel.person.getItem(id)).data;
      const mappedData = toPersonModel(tmdbPersonDetail);
      storedPerson = await Person.create(mappedData);
    }
    return type === "cast"
      ? { _id: storedPerson._id, character }
      : { _id: storedPerson._id };
  };

  updateCredits = async (_id, tmdbID) => {
    const tmdbId = tmdbID ? tmdbID : await this.getTmdbId(_id);
    const tmdbCredits = (await this.tmdbApi.getCredits(tmdbId)).data;
    const [cast, directors] = await Promise.all([
      Promise.all(tmdbCredits.cast.map((d) => this.mapCreditData(d, "cast"))),
      Promise.all(
        tmdbCredits.crew
          .filter(isDirector)
          .map((d) => this.mapCreditData(d, "director"))
      ),
    ]);
    const updatedMedia = await this.model.findByIdAndUpdate(
      _id,
      { cast, directors },
      { returnDocument: "after", projection: { title: 1 } }
    );
    return updatedMedia;
  };
}

class BackendMovieApi extends BackendMediaApi {
  constructor() {
    super(Movie, tmdbModel.movie, toMovieModel);
  }
}

class BackendShowApi extends BackendMediaApi {
  constructor() {
    super(Show, tmdbModel.show, toShowModel);
  }

  updateSeasons = async (_id, tmdbID) => {
    const tmdbId = tmdbID ? tmdbID : await this.getTmdbId(_id);
    const tmdbSeasons = await this.tmdbApi.getSeasons(tmdbId);
    const mappedSeasons = tmdbSeasons.map(toSeasonModel);
    return Show.findByIdAndUpdate(
      _id,
      { seasons: mappedSeasons },
      { returnDocument: "after", projection: { title: 1 } }
    );
  };
}

class BackendPersonApi extends BackendBaseApi {
  constructor() {
    super(Person, tmdbModel.person, toPersonModel);
  }
}

module.exports = {
  BackendBaseApi,
  BackendMovieApi,
  BackendShowApi,
  BackendPersonApi,
};
