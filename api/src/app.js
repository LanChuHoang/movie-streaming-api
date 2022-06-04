const express = require("express");
const movieRouter = require("./routes/movie/movie.route");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Movie streaming api");
});

app.use("/api/movie", movieRouter);

module.exports = app;
