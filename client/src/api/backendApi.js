import axiosClient, { axiosPrivateClient } from "./axiosClient 1";

const endpoint = {
  register: "/auth/register",
  login: "/auth/login",
  refreshToken: "/auth/refresh_token",
  logout: "/auth/logout",
  getUsers: "/user",
};

const backendApi = {
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

  interceptors: axiosClient.interceptors,

  axiosPrivateClient: axiosPrivateClient,
};

export default backendApi;
