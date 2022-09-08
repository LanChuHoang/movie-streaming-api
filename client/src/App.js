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
import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Users from "./pages/admin/users/Users";
import Movies from "./pages/admin/movies/Movies";
import Shows from "./pages/admin/shows/Shows";
import People from "./pages/admin/people/People";
import UpsertMovie from "./pages/admin/upsert-movie/UpsertMovie";

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
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="movies" element={<Movies />} />
            <Route path="shows" element={<Shows />} />
            <Route path="people" element={<People />} />

            <Route path="user">
              <Route index element={<p>Add user</p>} />
              <Route path=":id" element={<p>Edit user</p>} />
            </Route>
            <Route path="movie">
              <Route index element={<UpsertMovie />} />
              <Route path=":id" element={<UpsertMovie />} />
            </Route>
            <Route path="show">
              <Route index element={<p>Add show</p>} />
              <Route path=":id" element={<p>Edit show</p>} />
            </Route>
            <Route path="person">
              <Route index element={<p>Add person</p>} />
              <Route path=":id" element={<p>Edit person</p>} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<h1>404 Not found</h1>} />
    </Routes>
  );
}

export default App;
