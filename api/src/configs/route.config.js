const movieConfig = require("./route.config.movie");
const showConfig = require("./route.config.show");
const personConfig = require("./route.config.person");
const userConfig = require("./route.config.user");

const SORT = {
  FIELDS: {
    ADMIN: {
      MOVIE: movieConfig.ADMIN_SORT_FIELDS,
      SHOW: showConfig.ADMIN_SORT_FIELDS,
      PERSON: personConfig.ADMIN_SORT_FIELDS,
      USER: userConfig.ADMIN_SORT_FIELDS,
    },
    USER: {
      MOVIE: movieConfig.USER_SORT_FIELDS,
      SHOW: showConfig.USER_SORT_FIELDS,
      PERSON: personConfig.USER_SORT_FIELDS,
      USER: userConfig.USER_SORT_FIELDS,
    },
  },
  ORDERS: ["asc", "desc"],
};

const ADMIN_DEFAULT_PROJECTION = {
  __v: 0,
  password: 0,
  refreshToken: 0,
};
const USER_DEFAULT_PROJECTION = {
  __v: 0,
  createdAt: 0,
  updatedAt: 0,
  password: 0,
  refreshToken: 0,
};

const PROJECTION = {
  ADMIN: {
    DEFAULT: {
      MOVIE: ADMIN_DEFAULT_PROJECTION,
      SHOW: ADMIN_DEFAULT_PROJECTION,
      PERSON: ADMIN_DEFAULT_PROJECTION,
      USER: ADMIN_DEFAULT_PROJECTION,
    },
  },
  USER: {
    DEFAULT: {
      MOVIE: USER_DEFAULT_PROJECTION,
      SHOW: USER_DEFAULT_PROJECTION,
      PERSON: USER_DEFAULT_PROJECTION,
      USER: { ...ADMIN_DEFAULT_PROJECTION, createdAt: 0 },
    },
  },
  CUSTOM: {
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
    SHOW_BRIEF_SEASONS: {},
    PERSON_BRIEF_INFO: {
      _id: 1,
      name: 1,
      avatarUrl: 1,
    },
  },
};

module.exports = {
  errorResponse: {
    DEFAULT_500_ERROR: { error: "Something went wrong" },
    DEFAULT_404_ERROR: { error: "Requested resource not found" },
    DEFAULT_403_ERROR: { error: "Permission denined" },
    DEFAULT_401_ERROR: { error: "Unauthorize" },
    INVALID_QUERY: { error: "Invalid query" },
    INVALID_TOKEN: { error: "Invalid token" },
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
    INVALID_GENDER: {
      error: "Invalid gender",
    },
    INVALID_JOB: {
      error: "Invalid job",
    },
    INVALID_STATS_DETAIL_TYPE: {
      error: "Invalid stats option",
    },
  },
  ACCESS_TOKEN_EXPIRE_TIME: 15 * 60 * 10000, // 15 mins
  REFRESH_TOKEN_EXPIRE_TIME: 24 * 60 * 60, // 1d
  DEFAULT_PAGE_SIZE: 30,
  PROJECTION,
  SORT,
};
