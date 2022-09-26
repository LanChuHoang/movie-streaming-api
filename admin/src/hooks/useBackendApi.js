import { useEffect } from "react";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";
import backendApi from "../api/backendApi";

const useBackendApi = () => {
  const { auth } = useAuth();
  const refresh = useRefreshToken(); // refresh and store token to auth state

  useEffect(() => {
    const requestInterceptor = backendApi.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"])
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = backendApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 403) {
          console.log("Failed 403");
          const newToken = await refresh();
          const prevConfig = error.config;
          prevConfig.headers["Authorization"] = `Bearer ${newToken}`;
          // resent prev request
          return backendApi.axiosPrivateClient(prevConfig);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      backendApi.interceptors.request.eject(requestInterceptor);
      backendApi.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, refresh]);

  return backendApi;
};

export default useBackendApi;
