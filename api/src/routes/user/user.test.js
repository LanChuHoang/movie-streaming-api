const { adminAgent, userAgent } = require("../../tests/agent");
const { errorResponse } = require("../../configs/route.config");
const testHelper = require("../../tests/test.helper");
const User = require("../../models/user/User");

beforeAll(testHelper.connectDB);
afterAll(testHelper.disconnectDB);
afterEach(async () => {
  await User.deleteMany();
});

describe("User routes", () => {
  const BASE_ENDPOINT = "/api/user";
  const validUsers = [
    {
      username: "validuser0",
      email: "validuser@gmail.com",
      password: "a",
    },
    {
      username: "validuser1",
      email: "validuser1@gmail.com",
      password: "a",
    },
    {
      username: "validuser2",
      email: "validuser2@gmail.com",
      password: "a",
    },
  ];

  describe("GET /api/user", () => {
    test("case: Success", async () => {
      await User.insertMany(validUsers);
      const responses = await Promise.all(
        validUsers.map((_, i) =>
          adminAgent.get(BASE_ENDPOINT).query({
            page: i + 1,
            limit: 1,
            sort: "username:desc",
          })
        )
      );
      const usernames = responses.map((r) => r.body.docs[0]?.username);
      expect(usernames).toEqual(validUsers.map((p) => p.username).reverse());
    });
  });

  describe("GET /api/user/:id", () => {
    test("case: Success", async () => {
      const mockUser = await User.create(validUsers[0]);
      await adminAgent
        .get(`${BASE_ENDPOINT}/${mockUser._id}`)
        .expect((res) => expect(res.body._id).toEqual(mockUser._id.toString()));
    });
  });

  describe("UPDATE /api/user/:id", () => {
    test("case: Success", async () => {
      const mockUser = await User.create(validUsers[0]);
      const updateData = { username: "updated" };
      await adminAgent
        .patch(`${BASE_ENDPOINT}/${mockUser._id}`)
        .send(updateData)
        .expect((res) =>
          expect(res.body.username).toEqual(updateData.username)
        );
    });
  });

  describe("DELETE /api/user/:id", () => {
    test("case: Success", async () => {
      const mockUser = await User.create(validUsers[0]);
      await adminAgent
        .delete(`${BASE_ENDPOINT}/${mockUser._id}`)
        .expect((res) => expect(res.body._id).toEqual(mockUser._id.toString()));
    });
  });
});
