import { createTheme } from "@mui/material/styles";

const LightTheme = createTheme({
  typography: {
    fontFamily: [
      "Inter",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

export default LightTheme;
