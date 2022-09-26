const ADMIN_SORT_FIELDS = [
  "_id",
  "title",
  "adult",
  "runtime",
  "firstAirDate",
  "lastAirDate",
  "genres",
  "countries",
  "isUpcoming",
  "createdAt",
];

const USER_SORT_FIELDS = ["lastAirDate"];

module.exports = {
  ADMIN_SORT_FIELDS,
  USER_SORT_FIELDS,
};
