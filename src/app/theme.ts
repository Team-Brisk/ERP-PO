import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Prompt", "Kanit", "Roboto", "sans-serif"',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 400,
      color: '#666',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    caption: {
        fontWeight: 600,
      fontSize: '1.5rem',
      color: '#999',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
});

export default theme;
