import { Outlet } from "react-router-dom";
import MainHeader from "../headers/main-header/MainHeader";
import Footer from "../footer/Footer";

const MainLayout = () => {
  document.body.style.backgroundColor = "#0f0f0f";

  return (
    <div>
      <MainHeader />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
