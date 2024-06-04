// _app.js
import {SnackbarProvider} from 'notistack';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../styles/theme';
import '../styles/globals.css';
import {DataProvider} from '../context/DataContext';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={2}>
      <DataProvider>
          <Component {...pageProps} />
        </DataProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default MyApp;
