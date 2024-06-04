import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#005B96', // A calming blue
    },
    secondary: {
      main: '#00A859', // A green for success and health
    },
    error: {
      main: '#D32F2F', // A red for errors
    },
    warning: {
      main: '#FFA000', // A yellow for warnings
    },
    info: {
      main: '#1976D2', // A different shade of blue for information
    },
    success: {
      main: '#388E3C', // A green for success messages
    },
    background: {
      default: '#F4F6F8', // A light grey for general background
      paper: '#FFFFFF', // White for paper elements
    },
    text: {
      primary: '#2E3B4E', // Dark grey for primary text
      secondary: '#6C757D', // Grey for secondary text
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h1: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '0.02em',
    },
    h2: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '0.02em',
    },
    h3: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
      fontSize: '1.75rem',
      letterSpacing: '0.02em',
    },
    h4: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
      fontSize: '1.5rem',
      letterSpacing: '0.02em',
    },
    h5: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
      fontSize: '1.25rem',
      letterSpacing: '0.02em',
    },
    h6: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
      fontSize: '1rem',
      letterSpacing: '0.02em',
    },
    body1: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      letterSpacing: '0.02em',
    },
    body2: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      letterSpacing: '0.02em',
    },
  },
});

export default theme;
