export const TIMES_IN_DAY = 24 * 60 * 60 * 1000;

function parseJwt(token) {
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
  return new Date(fullISOStr).toLocaleString();
}

export function toShortDateFormat(shortISOStr) {
  const [year, month, day] = shortISOStr.split("-");
  return day ? day + "/" + month : month + "/" + year;
}

export default parseJwt;
