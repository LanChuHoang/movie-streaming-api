const ADMIN_SORT_FIELDS = [
  "_id",
  "title",
  "adult",
  "runtime",
  "releaseDate",
  "genres",
  "countries",
  "isUpcoming",
  "createdAt",
];

const USER_SORT_FIELDS = ["releaseDate"];

module.exports = {
  ADMIN_SORT_FIELDS,
  USER_SORT_FIELDS,
};
