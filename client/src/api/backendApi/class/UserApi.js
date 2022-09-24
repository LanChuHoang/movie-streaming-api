import BaseApi from "./BaseApi";
import { parseJwt, toShortISOString } from "../helper";

const endpoint = {
  base: "/user",
  search: "/user/search",
  register: "/auth/register",
  login: "/auth/login",
  refreshToken: "/auth/refresh_token",
  logout: "/auth/logout",
  userOverallStats: "/statistic/user/overall",
  userDetailStats: "/statistic/user/detail",
};

class UserApi extends BaseApi {
  constructor() {
    super(endpoint);
  }

  registerUser = (username, email, password) => {
    return this.privateClient.post(this.endpoint.register, {
      username,
      email,
      password,
    });
  };

  loginUser = (email, password) => {
    return this.privateClient.post(this.endpoint.login, { email, password });
  };

  refreshToken = () => {
    return this.privateClient.get(this.endpoint.refreshToken);
  };

  refetchUserDetail = (accessToken) => {
    const payload = parseJwt(accessToken);
    const path = this.endpoint.getUsers + "/" + payload.id;
    return this.client.get(path, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  logoutUser = () => {
    return this.privateClient.post(this.endpoint.logout);
  };

  getUsers = (params = {}) => {
    return this.client.get(this.endpoint.base, { params });
  };

  searchUsers = (params = {}) => {
    return this.client.get(this.endpoint.search, { params });
  };

  getUser = (id) => {
    return this.getItem(id);
  };

  deleteUser = (id) => {
    return this.deleteItem(id);
  };

  getUserOverallStats = () => {
    return this.client.get(this.endpoint.userOverallStats);
  };

  getUserDetailStats = (startDate, endDate, type) => {
    const params = {
      from: toShortISOString(startDate),
      to: toShortISOString(endDate),
      type,
    };
    return this.client.get(this.endpoint.userDetailStats, { params });
  };
}

export default UserApi;
