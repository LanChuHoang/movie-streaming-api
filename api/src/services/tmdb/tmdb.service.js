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
    const api = models.show;
    await api.updateMany({
      updateCallback: api.updateTrailers,
    });
  } catch (error) {
    console.log(error);
  } finally {
    await mongoService.disconnect();
  }
}

update();
