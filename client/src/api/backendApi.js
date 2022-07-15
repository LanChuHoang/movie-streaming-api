import axiosClient, { axiosPrivateClient } from "./axiosClient 1";

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

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

  getUserDetail: (id) => {
    return axiosClient.get(endpoint.getUsers + "/" + id);
  },

  refetchUserDetail: (accessToken) => {
    const payload = parseJwt(accessToken);
    return axiosClient.get(endpoint.getUsers + "/" + payload.id, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  getItems: (itemType, params = {}) => {
    const path = `/${itemType}`;
    return axiosClient.get(path, { params });
  },

  searchItems: (itemType, params) => {
    const path = `${itemType}/search`;
    return axiosClient.get(path, { params });
  },

  interceptors: axiosClient.interceptors,

  axiosPrivateClient: axiosPrivateClient,
};

export default backendApi;
