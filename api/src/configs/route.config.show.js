const showAdminSortFields = [
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

const showUserSortFields = ["lastAirDate"];

module.exports = {
  showAdminSortFields,
  showUserSortFields,
};
