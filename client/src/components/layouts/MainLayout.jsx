import { Outlet } from "react-router-dom";
import MainHeader from "../headers/main-header/MainHeader";
import Footer from "../footer/Footer";

const MainLayout = () => {
  return (
    <div>
      <MainHeader />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
