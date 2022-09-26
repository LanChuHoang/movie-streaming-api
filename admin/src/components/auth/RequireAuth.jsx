import { Outlet, Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ forAdmin }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth?.accessToken)
    return <Navigate to="/login" state={{ from: location }} replace />;
  if (forAdmin && !auth?.isAdmin) return <h1>Permission denined</h1>;
  return <Outlet />;
};

export default RequireAuth;
