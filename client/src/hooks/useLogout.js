import backendApi from "../api/backendApi/backendApi";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();
  const logout = async () => {
    try {
      await backendApi.user.logoutUser();
      setAuth({});
    } catch (error) {
      console.log(error);
    }
  };
  return logout;
};

export default useLogout;
