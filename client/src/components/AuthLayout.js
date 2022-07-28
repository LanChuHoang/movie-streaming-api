import { Outlet } from "react-router-dom";
import AuthHeader from "./auth-header/AuthHeader";

const AuthLayout = () => {
  return (
    <div>
      <AuthHeader />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
