import React from 'react';
import { ThemeProvider } from '@material-ui/styles';

//
import MainRouter from './main-router';
import ErrorBoundry from './components/error-boundry.comp'

// style
import theme from './theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
    <ErrorBoundry>
      <MainRouter />
    </ErrorBoundry>
    </ThemeProvider>
  );
}
