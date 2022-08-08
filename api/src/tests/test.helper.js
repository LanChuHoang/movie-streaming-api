const mongoose = require("mongoose");
const app = require("../app");
const agent = require("supertest").agent(app);
const queryString = require("query-string");
const { errorResponse } = require("../configs/route.config");

async function connectDB() {
  await mongoose.connect(globalThis.__MONGO_URI__);
  await mongoose.connection.collections.movies.createIndex({ title: "text" });
}

async function disconnectDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}

async function clearDB() {
  const collections = mongoose.connection.collections;
  for (const [key, value] of Object.entries(collections)) {
    const { deletedCount } = await value.deleteMany();
    // console.log(`Deleted collection ${key} - ${deletedCount} items`);
  }
}

async function testInvalidParamsRequest(endpoint, params = {}) {
  const url = queryString.stringifyUrl({ url: endpoint, query: params });
  console.log(url);
  const response = await agent
    .get(url)
    .expect("Content-Type", /json/)
    .expect(400);
  expect(response.body).toEqual(errorResponse.INVALID_QUERY);
}

function testNotFoundIDCase(endpoint, path = "") {
  test("case: Not found ID", async () => {
    const id = "62ad818184ccfdf2964ba774";
    const response = await agent
      .get(`${endpoint}/${id}${path}`)
      .expect("Content-Type", /json/)
      .expect(404);
    expect(response.body).toEqual(errorResponse.DEFAULT_404_ERROR);
  });
}

function testInvalidIDParam(endpoint) {
  test('case: Invalid "id" param', () =>
    testInvalidParamsRequest(`${endpoint}/a`));
}

function testInvalidPageParam(endpoint) {
  test('case: Invalid "page" param', () =>
    testInvalidParamsRequest(endpoint, { page: "a" }));
}

function testInvalidQueryParam(endpoint) {
  test('case: Missing "query" param', () => testInvalidParamsRequest(endpoint));
  test('case: Invalid "query" param', () => {
    const invalidParams = [" ", ""];
    invalidParams.forEach((p) =>
      testInvalidParamsRequest(endpoint, { query: p })
    );
  });
}

function testInvalidFilterParams(endpoint) {
  describe("case: Invalid filter params", () => {
    const invalidParam = "a";
    const fields = ["genre", "country", "year", "sort", "page"];
    fields.forEach((f) => {
      test(`case: Invalid '${f}' param`, async () => {
        const params = {};
        params[`${f}`] = invalidParam;
        await testInvalidParamsRequest(endpoint, params);
      });
    });
  });
}

function testInvalidBodyRequest(agent, bodies, expectedError, status = 400) {
  return Promise.all(
    bodies.map((b) =>
      agent
        .send(b)
        .expect("Content-Type", /json/)
        .expect(status)
        .expect((res) => expect(res.body).toEqual(expectedError))
    )
  );
}

module.exports = {
  connectDB,
  disconnectDB,
  clearDB,
  testNotFoundIDCase,
  testInvalidIDParam,
  testInvalidPageParam,
  testInvalidQueryParam,
  testInvalidFilterParams,
  testInvalidBodyRequest,
};
