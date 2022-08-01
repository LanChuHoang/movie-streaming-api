const TIMES_IN_DAY = 24 * 60 * 60 * 1000;

function getStartOfDay(date = new Date()) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

function getMonday(date = new Date()) {
  const timesInDay = 24 * 60 * 60 * 1000;
  const diff = date.getDay() !== 0 ? date.getDay() - 1 : 6;
  const startDate = new Date(date.getTime() - diff * timesInDay);
  return startDate;
}

function getSunday(date = new Date()) {
  date.setHours(0, 0, 0, 0);
  const timesInDay = 24 * 60 * 60 * 1000;
  const diff = date.getDay() !== 0 ? 7 - date.getDay() : 0;
  const endDate = new Date(date.getTime() + diff * timesInDay);
  return endDate;
}

function isShortISOFormat(dateStr) {
  if (!dateStr) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateStr.match(regex)) return false;
  const date = new Date(dateStr);
  const timestamp = date.getTime();
  if (typeof timestamp !== "number" || isNaN(timestamp)) return false;
  return date.toISOString().startsWith(dateStr);
}

module.exports = {
  TIMES_IN_DAY,
  getStartOfDay,
  getMonday,
  getSunday,
  isShortISOFormat,
};
