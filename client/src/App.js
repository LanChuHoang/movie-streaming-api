import "swiper/swiper.min.css";
import "./assets/boxicons-2.0.7/css/boxicons.min.css";
import "./App.scss";

import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Detail from "./pages/detail/Detail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/:itemType" element={<Catalog />} />
        <Route path="/:itemType/search/:query" element={<Catalog />} />
        <Route path="/:itemType/:id" element={<Detail />} />
      </Route>
    </Routes>
  );
}

export default App;
