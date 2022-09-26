import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import AuthProvider from "./context/AuthProvider";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import LightTheme from "./themes/light-theme/LightTheme";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={LightTheme}>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </ThemeProvider>
        </StyledEngineProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
