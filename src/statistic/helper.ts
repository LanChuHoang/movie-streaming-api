export const TIMES_IN_DAY = 24 * 60 * 60 * 1000;

export function getStartOfDay(date = new Date()) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

export function getMonday(date = new Date()) {
  const startOfDay = getStartOfDay(date);
  const diff = startOfDay.getDay() !== 0 ? startOfDay.getDay() - 1 : 6;
  const startDate = new Date(startOfDay.getTime() - diff * TIMES_IN_DAY);
  return startDate;
}

export function getSunday(date = new Date()) {
  const startOfDay = getStartOfDay(date);
  const diff = startOfDay.getDay() !== 0 ? 7 - startOfDay.getDay() : 0;
  const endDate = new Date(startOfDay.getTime() + diff * TIMES_IN_DAY);
  return endDate;
}

export function isShortISOFormat(dateStr?: string) {
  if (!dateStr) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateStr.match(regex)) return false;
  const date = new Date(dateStr);
  const timestamp = date.getTime();
  if (typeof timestamp !== "number" || isNaN(timestamp)) return false;
  return date.toISOString().startsWith(dateStr);
}

export function getItemTypeOfEndpoint(url?: string) {
  return url?.split("?")[0]?.split("/")[2].toUpperCase();
}

export function isPositiveInteger(str: string) {
  const n = Number(str);
  return Number.isInteger(n) && n > 0;
}

export function isNaturalNumber(str: string) {
  const n = Number(str);
  return Number.isInteger(n) && n >= 0;
}
