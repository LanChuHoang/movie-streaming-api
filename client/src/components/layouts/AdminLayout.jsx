import AdminHeader from "../headers/admin-header/AdminHeader";
import SideBar from "../side-bar/SideBar";
import { Outlet } from "react-router-dom";
import "./adminLayout.scss";

const AdminLayout = () => {
  return (
    <div className="admin-layout-container">
      <SideBar />
      <div className="right-side-container">
        <AdminHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
