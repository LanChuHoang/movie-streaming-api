import axiosClient, { axiosPrivateClient } from "./axiosClient";
import MovieApi from "./backendApi/MovieApi";
import PersonApi from "./backendApi/PersonApi";
import ShowApi from "./backendApi/ShowApi";
import UserApi from "./backendApi/UserApi";
import { parseJwt, toShortISOString } from "./helper";

const endpoint = {
  register: "/auth/register",
  login: "/auth/login",
  refreshToken: "/auth/refresh_token",
  logout: "/auth/logout",
  getUsers: "/user",
  searchUsers: "/user/search",
  randomMovie: "/movie/random",
  userOverallStats: "/statistic/user/overall",
  userDetailStats: "/statistic/user/detail",

  movie: {
    base: "/movie",
    search: "/movie/search",
  },
  show: {
    base: "/show",
    search: "/show/search",
  },
};

export const statType = {
  daily: "daily",
  monthly: "monthly",
};

export const listType = {
  popular: "",
  lastest: "",
  upcoming: "upcoming",
  similar: "similar",
};

export const itemType = {
  movie: "movie",
  show: "show",
};

const SHOW_BASE_FIELDS = [
  "_id",
  "posterUrl",
  "title",
  "firstAirDate",
  "lastAirDate",
  "createdAt",
];

const MOVIE_BASE_FIELDS = [
  "_id",
  "posterUrl",
  "title",
  "runtime",
  "releaseDate",
  "createdAt",
  "isUpcoming",
];

const PERSON_BASE_FIELDS = [
  "_id",
  "avatarUrl",
  "name",
  "dob",
  "pob",
  "job",
  "createdAt",
];

const parseFieldsParam = (params) =>
  params.fields
    ? { ...params, fields: params.fields.join(",") }
    : { ...params };

const userApi = new UserApi();
const movieApi = new MovieApi();
const showApi = new ShowApi();
const personApi = new PersonApi();

const backendApi = {
  // User
  registerUser: (username, email, password) => {
    return axiosPrivateClient.post(endpoint.register, {
      username,
      email,
      password,
    });
  },

  loginUser: (email, password) => {
    return axiosPrivateClient.post(endpoint.login, { email, password });
  },

  refreshToken: () => {
    return axiosPrivateClient.get(endpoint.refreshToken);
  },

  logoutUser: () => {
    return axiosPrivateClient.post(endpoint.logout);
  },

  getUsers: (params = {}) => {
    return axiosClient.get(endpoint.getUsers, { params });
  },

  searchUsers: (params = {}) => {
    return axiosClient.get(endpoint.searchUsers, { params });
  },

  getUserDetail: (id) => {
    return axiosClient.get(endpoint.getUsers + "/" + id);
  },

  refetchUserDetail: (accessToken) => {
    const payload = parseJwt(accessToken);
    const path = endpoint.getUsers + "/" + payload.id;
    return axiosClient.get(path, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  deleteUser: (id) => {
    return axiosClient.delete(`/user/${id}`);
  },

  // Item
  getItems: (itemType, params = {}) => {
    const path = "/" + itemType;
    return axiosClient.get(path, { params });
  },

  searchItems: (itemType, params) => {
    params.fields =
      itemType === "movie"
        ? MOVIE_BASE_FIELDS.join(",")
        : SHOW_BASE_FIELDS.join(",");
    const path = `/${itemType}/search`;
    return axiosClient.get(path, { params });
  },

  getSimilarItems: (itemType, itemId, params) => {
    const path = `/${itemType}/${itemId}/similar`;
    return axiosClient.get(path, { params });
  },

  getItemDetail: (itemType, id, params = {}) => {
    const path = `/${itemType}/${id}`;
    return axiosClient.get(path, { params });
  },

  getList: (itemType, listType, params = {}) => {
    const path = `/${itemType}/${listType}`;
    return axiosClient.get(path, { params });
  },

  // Movie
  addMovie: (movieData) => {
    return axiosClient.post("/movie", movieData);
  },

  getRandomMovies: async () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      const { data } = await axiosClient.get(endpoint.randomMovie);
      items.push(data[0]);
    }
    return items;
  },

  updateMovie: (id, movieData) => {
    return axiosClient.patch(`/movie/${id}`, movieData);
  },

  deleteMovie: (id) => {
    return axiosClient.delete(`/movie/${id}`);
  },

  // New api
  user: userApi,
  movie: movieApi,
  show: showApi,
  person: personApi,

  // People
  addPerson: (personData) => {
    return axiosClient.post("/person", personData);
  },

  getPeople: (params = {}) => {
    if (params.fields) params.fields = params.fields.join(",");
    return axiosClient.get("/person", { params });
  },

  searchPeople: (params = {}) => {
    if (params.fields) params.fields = params.fields.join(",");
    return axiosClient.get("/person/search", { params });
  },

  getPerson: (id) => {
    return axiosClient.get(`/person/${id}`);
  },

  updatePerson: (id, personData) => {
    return axiosClient.patch(`/person/${id}`, personData);
  },

  getCastDetail: (id) => {
    return axiosClient.get(`/person/${id}`);
  },

  getUserOverallStats: () => {
    return axiosClient.get(endpoint.userOverallStats);
  },

  getUserDetailStats: (startDate, endDate, type) => {
    const params = {
      from: toShortISOString(startDate),
      to: toShortISOString(endDate),
      type,
    };
    return axiosClient.get(endpoint.userDetailStats, { params });
  },

  interceptors: axiosClient.interceptors,

  axiosPrivateClient: axiosPrivateClient,
};

export default backendApi;
