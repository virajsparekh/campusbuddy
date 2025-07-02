import React from 'react';
import Box from '@mui/material/Box';

const LayoutContainer = ({
  children,
  ...rest
}) => (
  <Box
    sx={{
      maxWidth: 480,
      mx: 'auto',
      px: { xs: 2, sm: 3 },
      py: { xs: 3, sm: 5 },
      width: '100%',
    }}
    {...rest}
  >
    {children}
  </Box>
);

export default LayoutContainer; 