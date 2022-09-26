import { createTheme } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";

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
  palette: {
    primary: {
      main: "#7451f8",
    },
  },
});

export default LightTheme;
