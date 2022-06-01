const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Movie streaming api");
});

module.exports = app;
