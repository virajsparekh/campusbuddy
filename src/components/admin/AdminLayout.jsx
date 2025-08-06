import React from 'react';
import { Box } from '@mui/material';
import AdminSidebar from './AdminSidebar';

const SIDEBAR_WIDTH = 250;

export default function AdminLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          bgcolor: '#fff',
          zIndex: 1200,
          borderRight: '1px solid #e5e7eb',
        }}
      >
        <AdminSidebar />
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          ml: `${SIDEBAR_WIDTH}px`,
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          p: 4,
          backgroundColor: '#f9fafb',
          overflowX: 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
