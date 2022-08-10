const { adminAgent } = require("../../tests/agent");
const { errorResponse, PROJECTION } = require("../../configs/route.config");
const testHelper = require("../../tests/test.helper");
const Person = require("../../models/person/Person");

beforeAll(testHelper.connectDB);
afterAll(testHelper.disconnectDB);
afterEach(async () => {
  await Person.deleteMany();
});

async function testInvalidGenderJobDate(agentMethod) {
  const invalidGenders = ["", "a", " "].map((g) => ({ gender: g }));
  const invalidJobs = ["", "a", " "].map((j) => ({ job: j }));
  const invalidDates = ["", "a", " ", "2022/-1/-1", "2022-100-100"].map(
    (d) => ({ dob: d })
  );
  await testHelper.testInvalidBody(
    agentMethod,
    invalidGenders,
    errorResponse.INVALID_GENDER
  );
  await testHelper.testInvalidBody(
    agentMethod,
    invalidJobs,
    errorResponse.INVALID_JOB
  );
  await testHelper.testInvalidBody(
    agentMethod,
    invalidDates,
    errorResponse.INVALID_QUERY
  );
}

const BASE_ENDPOINT = "/api/person";
const validPeople = [
  {
    name: "valid person",
    gender: "male",
    job: "Actor",
    dob: "2000-01-01",
  },
  {
    name: "valid person1",
    gender: "male",
    job: "Actor",
    dob: "2000-01-01",
  },
  {
    name: "valid person2",
    gender: "male",
    job: "Director",
    dob: "2000-01-01",
  },
];

describe("Person routes", () => {
  describe("POST /api/person", () => {
    test("case: Success", async () => {
      await adminAgent
        .post(BASE_ENDPOINT)
        .send(validPeople[0])
        .expect("Content-Type", /json/)
        .expect(201)
        .expect((res) => expect(res.body.name).toEqual(validPeople[0].name));
    });

    test("case: Invalid gender, job, date", async () => {
      await testInvalidGenderJobDate(adminAgent.post(BASE_ENDPOINT));
    });
  });

  describe("GET /api/person", () => {
    test("case: Success", async () => {
      await Person.insertMany(validPeople);
      const responses = await Promise.all(
        validPeople.map((_, i) =>
          adminAgent.get(BASE_ENDPOINT).query({
            page: i + 1,
            limit: 1,
            sort: "name:desc",
          })
        )
      );
      const names = responses.map((r) => r.body.docs[0].name);
      expect(names).toEqual(validPeople.map((p) => p.name).reverse());
    });

    test("case: Invalid get items params", async () => {
      await testHelper.testInvalidGetItemsParams(BASE_ENDPOINT, adminAgent);
    });
  });

  describe("GET /api/person/search", () => {
    const url = `${BASE_ENDPOINT}/search`;
    beforeEach(async () => await Person.insertMany(validPeople));

    test("case: Success", async () => {
      const responses = await Promise.all(
        validPeople.map((_, i) =>
          adminAgent.get(url).query({
            page: i + 1,
            limit: 1,
            query: "valid",
            fields: "name,gender",
          })
        )
      );
      const received = responses.map((r) => ({
        name: r.body.docs[0].name,
        gender: r.body.docs[0].gender,
      }));
      const expected = validPeople.map((p) => ({
        name: p.name,
        gender: p.gender,
      }));
      expect(received).toEqual(expected);
    });

    test("case: Default page limit", async () => {
      const response = await adminAgent.get(url).query({ query: "valid" });
      const received = response.body.docs.map((d) => ({ name: d.name }));
      const expected = validPeople.map((p) => ({ name: p.name }));
      expect(received).toEqual(expected);
    });

    test("case: Invalid search items params", async () => {
      await testHelper.testInvalidSearchItemsParams(url, adminAgent);
    });
  });

  describe("GET /api/person/:id", () => {
    test("case: Success", async () => {
      const mockPerson = await Person.create(validPeople[0]);
      await adminAgent
        .get(`${BASE_ENDPOINT}/${mockPerson._id}`)
        .expect((res) =>
          expect(res.body._id).toEqual(mockPerson._id.toString())
        );
    });
  });

  describe("UPDATE /api/person/:id", () => {
    let url;
    beforeAll(async () => {
      mockPerson = await Person.create(validPeople[0]);
      url = `${BASE_ENDPOINT}/${mockPerson._id}`;
    });

    test("case: Success", async () => {
      const updateData = { name: "updated" };
      await adminAgent
        .patch(url)
        .send(updateData)
        .expect((res) => expect(res.body.name).toEqual(updateData.name));
    });

    test("case: Invalid gender, job, date", async () => {
      await testInvalidGenderJobDate(adminAgent.patch(url));
    });
  });

  describe("DELETE /api/person/:id", () => {
    test("case: Success", async () => {
      const mockPerson = await Person.create(validPeople[0]);
      await adminAgent
        .delete(`${BASE_ENDPOINT}/${mockPerson._id}`)
        .expect((res) =>
          expect(res.body._id).toEqual(mockPerson._id.toString())
        );
    });
  });
});
