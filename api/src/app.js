const express = require("express");
const authRouter = require("./routes/auth/auth.route");
const movieRouter = require("./routes/movie/movie.route");
const showRouter = require("./routes/show/show.route");
require("./models/person/person.model");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Movie streaming api");
});

app.use("/api/auth", authRouter);

app.use("/api/movie", movieRouter);
app.use("/api/show", showRouter);

module.exports = app;
