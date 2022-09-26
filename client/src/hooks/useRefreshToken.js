import backendApi from "../api/backendApi/backendApi";
import { parseJwt } from "../api/backendApi/helper";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    try {
      const { accessToken } = (await backendApi.user.refreshToken()).data;
      const { id, isAdmin } = parseJwt(accessToken);
      console.log("Prev access token ", auth?.accessToken);
      console.log("New access token ", accessToken);
      setAuth({ id, isAdmin, accessToken });
      return accessToken;
    } catch (error) {
      console.log("Refresh token failed ");
      console.log(error.response?.data || error, error.response?.status);
      setAuth({});
    }
  };

  return refresh;
};

export default useRefreshToken;
