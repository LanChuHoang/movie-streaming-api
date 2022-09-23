const mongoService = require("../mongo.service");
const { BackendMovieApi } = require("./models/backend/backend.class");

async function update() {
  try {
    await mongoService.connect();
    const api = new BackendMovieApi();
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
