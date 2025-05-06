import './../globals.css';
import { ThemeProvider } from '@mui/material/styles';
import { MuiTheme } from '../../plugins/mui';
import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Suspense } from 'react';
import AppLoading from '../components/layout/AppLoading';
import AppHeader from '../components/layout/AppHeader';
import AppSideBar from '../components/layout/AppSidebar';
import AppChildrenWrapper from '../components/layout/AppChildrenWrapper';
import AppProvider from '../components/layout/AppProvider';

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppProvider>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppHeader />
        <AppSideBar />
        <AppChildrenWrapper>
          {children}
        </AppChildrenWrapper>
      </Box>
    </AppProvider>
  );
}