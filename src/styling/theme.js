import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0074E0', // Custom primary color (purple)
    },
    secondary: {
      main: '#FF0000', // Custom secondary color (pink)
    },
    background: {
      default: '#f5f5f5', // Default background color
    },
    text: {
      primary: '#000000', // Custom text color
      secondary : '#ffffff' // Custom text color
    },
  },
});

export default theme;
