const movieAdminSortFields = [
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

const movieUserSortFields = ["releaseDate"];

module.exports = {
  movieAdminSortFields,
  movieUserSortFields,
};
