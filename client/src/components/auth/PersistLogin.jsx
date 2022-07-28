import useAuth from "../../hooks/useAuth";
import useRefreshToken from "../../hooks/useRefreshToken";
import { Outlet } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const PersistLogin = () => {
  const isFirstTime = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    const reLogin = async () => {
      console.log("Relogin");
      try {
        await refresh(true);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (!auth?.accessToken && isFirstTime.current) reLogin();
    else if (auth?.accessToken) setIsLoading(false);

    return () => {
      isFirstTime.current = false;
    };
  }, []);

  // useEffect(() => {
  //   console.log("Persist login render", isLoading, isFirstTime, auth);
  // }, [isLoading]);

  return isLoading ? <p>Loading</p> : <Outlet />;
};

export default PersistLogin;
