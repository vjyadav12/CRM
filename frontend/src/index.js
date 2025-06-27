import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './config/axios'; // Import axios config
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Vibrant blue
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff9800', // Soft orange
      contrastText: '#fff',
    },
    background: {
      default: '#f4f6fb', // Light background
      paper: '#fff',
    },
    success: {
      main: '#43a047',
    },
    warning: {
      main: '#ffa726',
    },
    error: {
      main: '#e53935',
    },
    info: {
      main: '#0288d1',
    },
  },
  shape: {
    borderRadius: 14, // Softer corners
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px 0 rgba(25, 118, 210, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
); 