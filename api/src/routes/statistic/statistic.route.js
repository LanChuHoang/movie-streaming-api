const express = require("express");
const statisticUserRouter = require("./user/statistic.user.route");

const router = express.Router();

router.use("/user", statisticUserRouter);

module.exports = router;
