import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00796b', // Modern teal color
      light: '#48a999', // Lighter teal for hover effect
    },
    secondary: {
      main: '#b2dfdb', // Light teal for backgrounds
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)",
    "0px 3px 6px rgba(0,0,0,0.16), 0px 3px 6px rgba(0,0,0,0.23)",
    "0px 10px 20px rgba(0,0,0,0.19), 0px 6px 30px rgba(0,0,0,0.23)",
    ...Array(21).fill("0px 10px 20px rgba(0,0,0,0.19), 0px 6px 30px rgba(0,0,0,0.23)"),
  ],
});


export default theme;
