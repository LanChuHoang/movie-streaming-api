import { Outlet, Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth?.accessToken)
    return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
};

export default RequireAuth;
