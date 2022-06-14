module.exports = {
  errorResponse: {
    DEFAULT_500_ERROR: { error: "Something went wrong" },
    DEFAULT_404_ERROR: { error: "Requested resource not found" },
    INVALID_QUERY: { error: "Invalid query" },
  },
  DEFAULT_PAGE_SIZE: 30,
  movieSortOptions: {
    releaseDate: { releaseDate: -1 },
    popular: "",
  },
  showSortOptions: {
    lastAirDate: { lastAirDate: -1 },
  },
  customProjection: {
    ITEM_BASE_INFO: {
      title: 1,
      overview: 1,
      adult: 1,
      runtime: 1,
      releaseDate: 1,
      genres: 1,
      trailers: 1,
      posterUrl: 1,
      thumbnailUrl: 1,
      backdropUrl: 1,
    },
    ITEM_FULL_INFO: {
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    },
    PERSON_BRIEF_INFO: {
      _id: 1,
      name: 1,
      avatarUrl: 1,
    },
  },
};
