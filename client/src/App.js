import "swiper/swiper.min.css";
import "./assets/boxicons-2.0.7/css/boxicons.min.css";
import "./App.scss";

import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import MainLayout from "./components/layouts/MainLayout";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Detail from "./pages/detail/Detail";
import RequireAuth from "./components/auth/RequireAuth";
import PersistLogin from "./components/auth/PersistLogin";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PersistLogin />}>
        <Route element={<RequireAuth forAdmin={false} />}>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="movie">
              <Route
                path="browse"
                element={<Catalog itemType="movie" browseType="browse" />}
              />
              <Route
                path="search"
                element={<Catalog itemType="movie" browseType="search" />}
              />
              <Route path=":id" element={<Detail itemType="movie" />} />
            </Route>
            <Route path="show">
              <Route
                path="browse"
                element={<Catalog itemType="show" browseType="browse" />}
              />
              <Route
                path="search"
                element={<Catalog itemType="show" browseType="search" />}
              />
              <Route path=":id" element={<Detail itemType="show" />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<h1>404 Not found</h1>} />
    </Routes>
  );
}

export default App;
