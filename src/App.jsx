import { ThemeProvider } from '@material-ui/styles';

import MainRouter from './main-router';
import ErrorBoundary from './components/error-boundary.comp';

import theme from './theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <MainRouter />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
