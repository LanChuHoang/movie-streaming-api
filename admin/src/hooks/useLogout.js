import backendApi from "../api/backendApi";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();
  const logout = async () => {
    try {
      await backendApi.logoutUser();
      setAuth({});
    } catch (error) {
      console.log(error);
    }
  };
  return logout;
};

export default useLogout;
