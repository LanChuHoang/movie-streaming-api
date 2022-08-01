const {
  getStartOfDay,
  TIMES_IN_DAY,
  getMonday,
  getSunday,
  isShortISOFormat,
} = require("../../../helpers/helper");
const { errorResponse } = require("../../../configs/route.config");
const userModel = require("../../../models/user/user.model");

async function getOverallStats(req, res, next) {
  try {
    const today = getStartOfDay();
    const tomorrow = new Date(today.getTime() + TIMES_IN_DAY);
    const yesterday = new Date(today.getTime() - TIMES_IN_DAY);
    const dayInLastWeek = new Date(today.getTime() - 7 * TIMES_IN_DAY);

    const thisMonth = today.getMonth();
    const lastMonth = thisMonth - 1 >= 0 ? thisMonth - 1 : 11;
    const thisYear = today.getFullYear();
    const thisMonthStart = new Date(thisYear, thisMonth, 1);
    const thisMonthEnd = new Date(thisYear, thisMonth + 1, 0);
    const lastMonthStart = new Date(thisYear, lastMonth, 1);
    const lastMonthEnd = new Date(thisYear, lastMonth + 1, 0);

    const [
      total,
      totalToday,
      totalYesterday,
      totalThisWeek,
      totalLastWeek,
      totalThisMonth,
      totalLastMonth,
    ] = await Promise.all([
      userModel.countUsers(),
      userModel.countUsers(today, tomorrow),
      userModel.countUsers(yesterday, today),
      userModel.countUsers(getMonday(today), getSunday(today)),
      userModel.countUsers(getMonday(dayInLastWeek), getSunday(dayInLastWeek)),
      userModel.countUsers(thisMonthStart, thisMonthEnd),
      userModel.countUsers(lastMonthStart, lastMonthEnd),
    ]);

    const response = {
      total,
      today: {
        count: totalToday,
        increased: totalToday >= totalYesterday,
      },
      thisWeek: {
        count: totalThisWeek,
        increased: totalThisWeek >= totalLastWeek,
      },
      thisMonth: {
        count: totalThisMonth,
        increased: totalThisMonth >= totalLastMonth,
      },
    };
    return res.send(response);
  } catch (error) {
    next(error);
  }
}

function validateGetDetailStatsInput(req, res, next) {
  const { from, to, type } = req.query;
  if (!isShortISOFormat(from) || !isShortISOFormat(to))
    return res.status(400).send(errorResponse.INVALID_DATE);
  if (type !== "daily" && type !== "monthly")
    return res.status(400).send(errorResponse.INVALID_STATS_DETAIL_TYPE);
  next();
}

async function getDetailStats(req, res, next) {
  try {
    const startDate = getStartOfDay(req.query.from);
    const endDate = getStartOfDay(req.query.to);
    const stats =
      req.query.type === "daily"
        ? await userModel.countUsersDaily(startDate, endDate)
        : await userModel.countUsersMonthly(startDate, endDate);
    return res.send(stats);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOverallStats,
  validateGetDetailStatsInput,
  getDetailStats,
};
