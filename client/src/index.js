import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import AuthProvider from "./context/AuthProvider";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StyledEngineProvider injectFirst>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </StyledEngineProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
