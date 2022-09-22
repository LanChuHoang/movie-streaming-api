import { Outlet, Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireUnauth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  if (auth?.accessToken) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default RequireUnauth;
