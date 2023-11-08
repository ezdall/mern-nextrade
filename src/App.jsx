import React from 'react';
import { ThemeProvider } from '@material-ui/styles';

//
import MainRouter from './main-router';

// style
import theme from './theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <MainRouter />
    </ThemeProvider>
  );
}
