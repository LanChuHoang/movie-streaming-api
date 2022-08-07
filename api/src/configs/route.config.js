const {
  movieAdminSortFields,
  movieUserSortFields,
} = require("./route.config.movie");
const {
  showAdminSortFields,
  showUserSortFields,
} = require("./route.config.show");
const { personAdminSortFields } = require("./route.config.person");
const { userAdminSortFields } = require("./route.config.user");

const adminSortOptions = {
  movie: movieAdminSortFields,
  person: personAdminSortFields,
  show: showAdminSortFields,
  user: userAdminSortFields,
};

const userSortOptions = {
  movie: movieUserSortFields,
  show: showUserSortFields,
};

const sortOrders = ["asc", "desc"];

module.exports = {
  errorResponse: {
    DEFAULT_500_ERROR: { error: "Something went wrong" },
    DEFAULT_404_ERROR: { error: "Requested resource not found" },
    INVALID_QUERY: { error: "Invalid query" },
    MISSING_USER_REGISTER_FIELDS: {
      error: "Missing username, email or password",
    },
    INVALID_USERNAME: { error: "Invalid username" },
    INVALID_EMAIL: { error: "Invalid email" },
    INVALID_PASSWORD: { error: "Invalid password" },
    USER_EXISTS: { error: "User already exists" },
    MISSING_USER_LOGIN_FIELDS: {
      error: "Missing email or password",
    },
    WRONG_EMAIL_PASSWORD: { error: "Wrong email or password" },
    MISSING_TITLE: { error: "Missing title field" },
    INVALID_GENRES: { error: "Invalid genres" },
    INVALID_COUNTRIES: { error: "Invalid countries" },
    INVALID_PEOPLE: { error: "Invalid people" },
    MOVIE_EXISTED: { error: "Movie already exists" },
    INVALID_DATE: {
      error: "Invalid date. Date must be formatted as 'YYYY-MM-DD'",
    },
    INVALID_STATS_DETAIL_TYPE: {
      error: "Invalid type",
    },
  },
  ACCESS_TOKEN_EXPIRE_TIME: 15 * 60, // 15 mins
  REFRESH_TOKEN_EXPIRE_TIME: 24 * 60 * 60, // 1d
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
  adminSortOptions,
  userSortOptions,
  sortOrders,
};
