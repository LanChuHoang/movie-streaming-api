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
}

export default UserApi;
