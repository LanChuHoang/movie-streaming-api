const { adminAgent } = require("../../tests/agent");
const { errorResponse } = require("../../configs/route.config");
const testHelper = require("../../tests/test.helper");
const Person = require("../../models/person/Person");

beforeAll(testHelper.connectDB);
afterAll(testHelper.disconnectDB);
afterEach(async () => {
  await Person.deleteMany();
});

describe("Person routes", () => {
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
  const invalidGenders = ["", "a", " "];
  const invalidJobs = ["", "a", " "];
  const invalidDates = ["", "a", " ", "2022/-1/-1", "2022-100-100"];

  describe("POST /api/person", () => {
    test("case: Success", async () => {
      await adminAgent
        .post(BASE_ENDPOINT)
        .send(validPeople[0])
        .expect("Content-Type", /json/)
        .expect(201)
        .expect((res) => expect(res.body.name).toEqual(validPeople[0].name));
    });

    test("case: Invalid Gender", async () =>
      await testHelper.testInvalidBodyRequest(
        adminAgent.post(BASE_ENDPOINT),
        invalidGenders.map((g) => ({ gender: g })),
        errorResponse.INVALID_GENDER
      ));

    test("case: Invalid Job", async () =>
      await testHelper.testInvalidBodyRequest(
        adminAgent.post(BASE_ENDPOINT),
        invalidJobs.map((j) => ({ job: j })),
        errorResponse.INVALID_JOB
      ));

    test("case: Invalid Date", async () =>
      await testHelper.testInvalidBodyRequest(
        adminAgent.post(BASE_ENDPOINT),
        invalidDates.map((d) => ({ dob: d })),
        errorResponse.INVALID_QUERY
      ));
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
    let mockPerson;
    beforeAll(async () => {
      mockPerson = await Person.create(validPeople[0]);
    });

    test("case: Success", async () => {
      const updateData = { name: "updated" };
      await adminAgent
        .patch(`${BASE_ENDPOINT}/${mockPerson._id}`)
        .send(updateData)
        .expect((res) => expect(res.body.name).toEqual(updateData.name));
    });

    test("case: Invalid Gender", async () =>
      await testHelper.testInvalidBodyRequest(
        adminAgent.patch(`${BASE_ENDPOINT}/${mockPerson._id}`),
        invalidGenders.map((g) => ({ gender: g })),
        errorResponse.INVALID_GENDER
      ));

    test("case: Invalid Job", async () =>
      await testHelper.testInvalidBodyRequest(
        adminAgent.patch(`${BASE_ENDPOINT}/${mockPerson._id}`),
        invalidJobs.map((j) => ({ job: j })),
        errorResponse.INVALID_JOB
      ));

    test("case: Invalid Date", async () =>
      await testHelper.testInvalidBodyRequest(
        adminAgent.patch(`${BASE_ENDPOINT}/${mockPerson._id}`),
        invalidDates.map((d) => ({ dob: d })),
        errorResponse.INVALID_QUERY
      ));
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
