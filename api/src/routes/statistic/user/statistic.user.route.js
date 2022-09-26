const express = require("express");
const statisticUserController = require("./statistic.user.controller");

const router = express.Router();

router.get("/overall", statisticUserController.getOverallStats);

router.get(
  "/detail",
  statisticUserController.validateGetDetailStatsInput,
  statisticUserController.getDetailStats
);

module.exports = router;
