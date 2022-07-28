import "swiper/swiper.min.css";
import "./assets/boxicons-2.0.7/css/boxicons.min.css";
import "./App.scss";

import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Layout from "./components/Layout";
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
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/:itemType/:browseType" element={<Catalog />} />
            <Route path="/:itemType/:id/detail" element={<Detail />} />
          </Route>
        </Route>

        <Route element={<RequireAuth forAdmin={true} />}>
          <Route path="/admin" element={<h1>Hello admin</h1>} />
        </Route>
      </Route>
      <Route path="*" element={<h1>404 Not found</h1>} />
    </Routes>
  );
}

export default App;
