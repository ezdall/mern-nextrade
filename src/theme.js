// eslint-disable-next-line camelcase
import { unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';
import { purple, orange, grey } from '@material-ui/core/colors';

const theme = unstable_createMuiStrictModeTheme({
  palette: {
    primary: {
      light: '#D1C4E9',
      main: '#957DAD', // Soft lavender
      dark: '#7E57C2',
      contrastText: '#FFFFFF'
    },
    secondary: {
      light: '#FF9D94',
      main: '#FF6F61', // Muted coral
      dark: '#E57373',
      contrastText: '#000000'
    },
    openTitle: grey[700], // Neutral gray for open titles
    protectedTitle: grey[500], // Neutral gray for protected titles
    type: 'light' // Light theme
  }
});

export default theme;
