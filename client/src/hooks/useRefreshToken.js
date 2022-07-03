import backendApi from "../api/backendApi";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const { accessToken } = (await backendApi.refreshToken()).data;
    setAuth((prevAuth) => {
      console.log("Prev access token ", prevAuth.accessToken);
      console.log("New access token ", accessToken);
      return { ...prevAuth, accessToken };
    });
    return accessToken;
  };

  return refresh;
};

export default useRefreshToken;
