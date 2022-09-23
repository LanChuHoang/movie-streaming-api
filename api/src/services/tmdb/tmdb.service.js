const mongoService = require("../mongo.service");
const { BackendMovieApi } = require("./models/backend/backend.class");

async function update() {
  try {
    await mongoService.connect();
    const api = new BackendMovieApi();
    await api.updateMany({
      pageSize: 2,
      limit: 2,
      updateCallback: api.updateCredits,
    });
  } catch (error) {
    console.log(error);
  } finally {
    await mongoService.disconnect();
  }
}

update();
