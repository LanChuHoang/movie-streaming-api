const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth/auth.route");
const userRouter = require("./routes/user/user.route");
const movieRouter = require("./routes/movie/movie.route");
const showRouter = require("./routes/show/show.route");
const personRouter = require("./routes/person/person.route");
const statisticRouter = require("./routes/statistic/statistic.route");
const errorHandler = require("./middlewares/errorHandler");
const { MAX_BODY_SIZE, CORS_OPTIONS } = require("./configs/app.config");

const app = express();

app.use(cors(CORS_OPTIONS));
app.use(express.json({ limit: MAX_BODY_SIZE }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/movie", movieRouter);
app.use("/api/show", showRouter);
app.use("/api/person", personRouter);
app.use("/api/statistic", statisticRouter);

app.use(errorHandler);

module.exports = app;
