import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layout: React.FC = () => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'background.default'
      }}
    >
      <Header />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout; 