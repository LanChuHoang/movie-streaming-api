const app = require("../app");
const supertest = require("supertest");
require("dotenv").config();

const userAgent = supertest
  .agent(app)
  .auth(process.env.USER_TEST_TOKEN, { type: "bearer" });
const adminAgent = supertest
  .agent(app)
  .auth(process.env.ADMIN_TEST_TOKEN, { type: "bearer" });

module.exports = {
  userAgent,
  adminAgent,
};
