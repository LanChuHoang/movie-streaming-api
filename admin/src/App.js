import "swiper/swiper.min.css";
import "./assets/boxicons-2.0.7/css/boxicons.min.css";
import "./App.scss";

import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import RequireAuth from "./components/auth/RequireAuth";
import PersistLogin from "./components/auth/PersistLogin";
import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Users from "./pages/admin/users/Users";
import Movies from "./pages/admin/movies/Movies";
import Shows from "./pages/admin/shows/Shows";
import People from "./pages/admin/people/People";
import UpsertMovie from "./pages/admin/upsert-movie/UpsertMovie";
import UpsertShow from "./pages/admin/upsert-show/UpsertShow";
import UpsertPerson from "./pages/admin/upsert-person/UpsertPerson";
import RequireUnauth from "./components/auth/RequireUnauth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PersistLogin />}>
        <Route path="/login" element={<RequireUnauth />}>
          <Route index element={<Login />} />
        </Route>
        <Route path="/" element={<RequireAuth forAdmin={true} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="user">
              <Route index element={<Users />} />
              <Route path="add" element={<p>Add user</p>} />
              <Route path=":id" element={<p>Edit user</p>} />
            </Route>
            <Route path="movie">
              <Route index element={<Movies />} />
              <Route path="add" element={<UpsertMovie />} />
              <Route path=":id" element={<UpsertMovie />} />
            </Route>
            <Route path="show">
              <Route index element={<Shows />} />
              <Route path="add" element={<UpsertShow />} />
              <Route path=":id" element={<UpsertShow />} />
            </Route>
            <Route path="person">
              <Route index element={<People />} />
              <Route path="add" element={<UpsertPerson />} />
              <Route path=":id" element={<UpsertPerson />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<h1>404 Not found</h1>} />
    </Routes>
  );
}

export default App;
