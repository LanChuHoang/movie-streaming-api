import AdminHeader from "../headers/admin-header/AdminHeader";
import SideBar from "../side-bar/SideBar";
import { Outlet } from "react-router-dom";
import "./adminLayout.scss";

const AdminLayout = () => {
  document.body.style.backgroundColor = "white";

  return (
    <div className="admin-layout-container">
      <SideBar />
      <AdminHeader />
      <div className="admin-layout-content-container">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
