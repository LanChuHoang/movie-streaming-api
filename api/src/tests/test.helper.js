const mongoose = require("mongoose");
const app = require("../app");
const agent = require("supertest").agent(app);
const queryString = require("query-string");
const { PROJECTION, errorResponse } = require("../configs/route.config");

async function connectDB() {
  await mongoose.connect(globalThis.__MONGO_URI__);
  await mongoose.connection.collections.movies.createIndex(
    { title: "text" },
    { default_language: "none" }
  );
  await mongoose.connection.collections.people.createIndex(
    { name: "text" },
    { default_language: "none" }
  );
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

function testInvalidBody(agentMethod, bodies, expectedError, status = 400) {
  return Promise.all(
    bodies.map((b) =>
      agentMethod
        .send(b)
        .expect("Content-Type", /json/)
        .expect(status)
        .expect((res) => expect(res.body).toEqual(expectedError))
    )
  );
}

function testInvalidParams(
  agentMethod,
  invalidParams,
  status = 400,
  expectedError = errorResponse.INVALID_QUERY
) {
  return Promise.all(
    invalidParams.map((p) =>
      agentMethod
        .query(p)
        .expect(status)
        .expect((res) => expect(res.body).toEqual(expectedError))
    )
  );
}

function testInvalidPaginationParams(url, agent) {
  const toParam = (params) => ({ query: "a", ...params });
  const invalidParams = ["a", "@", "-1", "1.1", "0"];
  const invalidPages = invalidParams.map((p) => toParam({ page: p }));
  const invalidLimits = invalidParams.map((p) => toParam({ limit: p }));
  const invalidFields = ["a,", "a, b", " ,a", ",", ",,"].map((p) =>
    toParam({ fields: p })
  );
  return Promise.all([
    testInvalidParams(agent.get(url), invalidPages),
    testInvalidParams(agent.get(url), invalidLimits),
    testInvalidParams(agent.get(url), invalidFields),
  ]);
}

function testInvalidGetItemsParams(url, agent) {
  const invalidSorts = [
    "",
    ":",
    " :",
    ": ",
    "a:",
    "a: ",
    ":a",
    " :a",
    "a:b",
  ].map((s) => ({ sort: s }));
  return Promise.all([
    testInvalidParams(agent.get(url), invalidSorts),
    testInvalidPaginationParams(url, agent),
  ]);
}

function testInvalidSearchItemsParams(url, agent) {
  const invalidQuerries = ["", " ", undefined].map((q) =>
    q ? { query: q } : {}
  );
  return Promise.all([
    testInvalidParams(agent.get(url), invalidQuerries),
    testInvalidPaginationParams(url, agent),
  ]);
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
  testInvalidBody,
  testInvalidParams,
  testInvalidPaginationParams,
  testInvalidGetItemsParams,
  testInvalidSearchItemsParams,
};
