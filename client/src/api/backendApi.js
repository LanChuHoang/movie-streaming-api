import axiosClient, { axiosPrivateClient } from "./axiosClient";
import parseJwt from "./helper";

const endpoint = {
  register: "/auth/register",
  login: "/auth/login",
  refreshToken: "/auth/refresh_token",
  logout: "/auth/logout",
  getUsers: "/user",
  randomMovie: "/movie/random",
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

  getUserList: (abortController) => {
    return axiosClient.get(endpoint.getUsers, {
      signal: abortController.signal,
    });
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

  // Item
  getItems: (itemType, params = {}) => {
    const path = "/" + itemType;
    return axiosClient.get(path, { params });
  },

  searchItems: (itemType, params) => {
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

  getRandomMovies: async () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      const { data } = await axiosClient.get(endpoint.randomMovie);
      items.push(data[0]);
    }
    return items;
  },

  interceptors: axiosClient.interceptors,

  axiosPrivateClient: axiosPrivateClient,
};

export default backendApi;
