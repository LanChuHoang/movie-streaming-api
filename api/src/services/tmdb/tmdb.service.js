const mongoService = require("../mongo.service");
const {
  BackendMovieApi,
  BackendShowApi,
  BackendPersonApi,
} = require("./models/backend/backend.class");

const models = {
  movie: new BackendMovieApi(),
  show: new BackendShowApi(),
  person: new BackendPersonApi(),
};

async function update() {
  try {
    await mongoService.connect();
    const api = models.movie;
    await api.updateMany({
      updateCallback: api.updateBaseData,
    });
  } catch (error) {
    console.log(error);
  } finally {
    await mongoService.disconnect();
  }
}

update();
