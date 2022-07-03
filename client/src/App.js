import "swiper/swiper.min.css";
import "./assets/boxicons-2.0.7/css/boxicons.min.css";
import "./App.scss";

import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Detail from "./pages/detail/Detail";
import RequireAuth from "./components/auth/RequireAuth";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/:itemType" element={<Catalog />} />
          <Route path="/:itemType/search/:query" element={<Catalog />} />
          <Route path="/:itemType/:id" element={<Detail />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
