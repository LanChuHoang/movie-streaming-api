import { isEmpty, isEqual, xorWith } from "lodash";

export const TIMES_IN_DAY = 24 * 60 * 60 * 1000;

export function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export function getStartOfDay(date = new Date()) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

export function getMonthStart(
  month = new Date().getMonth(),
  year = new Date().getFullYear()
) {
  return new Date(year, month, 1);
}

export function getMonthEnd(
  month = new Date().getMonth(),
  year = new Date().getFullYear()
) {
  return new Date(year, month + 1, 0);
}

export function toShortISOString(date) {
  return date.toLocaleDateString("fr-CA");
}

export function toFullDateFormat(fullISOStr) {
  return new Date(fullISOStr).toLocaleString("en-GB");
}

export function toShortDateFormat(shortISOStr) {
  const [year, month, day] = shortISOStr.split("-");
  return day ? day + "/" + month : month + "/" + year;
}

export function toBritishDate(utcDateString) {
  return utcDateString
    ? new Date(utcDateString).toLocaleDateString("en-GB", {
        timezone: "UTC",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";
}

export function fillMissingDailyStats(startDate, endDate, data) {
  const length = (endDate.getTime() - startDate.getTime()) / TIMES_IN_DAY;
  return Array.from({ length }, (_, i) => {
    const currentDate = toShortISOString(
      new Date(startDate.getTime() + i * TIMES_IN_DAY)
    );
    const currentData = data.find((d) => d.date === currentDate);
    return {
      Total: currentData?.totalUsers || 0,
      date: toShortDateFormat(currentDate),
    };
  });
}

export function fillMissingMonthlyStats(startDate, endDate, data) {
  const length = endDate.getMonth() - startDate.getMonth() + 1;

  return Array.from({ length }, (_, i) => {
    const currentDate =
      i + 1 < 10
        ? `${startDate.getFullYear()}-0${i + startDate.getMonth() + 1}`
        : `${startDate.getFullYear()}-${i + startDate.getMonth() + 1}`;
    const currentData = data.find((d) => d.month === currentDate);
    return {
      Total: currentData?.totalUsers || 0,
      date: toShortDateFormat(currentDate),
    };
  });
}

export const isArrayEqual = (x, y) => isEmpty(xorWith(x, y, isEqual));

export const shallowCompare = (obj1, obj2) =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every(
    (key) => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
  );

export const toYoutubeVideoUrl = (path) =>
  path ? `https://www.youtube.com/embed/${path}` : undefined;
