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
import Dashboard from "./pages/admin/dashboard/Dashboard";
import AdminLayout from "./components/layouts/AdminLayout";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PersistLogin />}>
        <Route element={<RequireAuth forAdmin={false} />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/:itemType/:browseType" element={<Catalog />} />
            <Route path="/:itemType/:id/detail" element={<Detail />} />
          </Route>
        </Route>

        <Route element={<RequireAuth forAdmin={true} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/users" element={<h1>Hello users</h1>} />
            <Route path="/admin/movies" element={<h1>Hello movies</h1>} />
            <Route path="/admin/shows" element={<h1>Hello shows</h1>} />
            <Route path="/admin/people" element={<h1>Hello people</h1>} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<h1>404 Not found</h1>} />
    </Routes>
  );
}

export default App;
