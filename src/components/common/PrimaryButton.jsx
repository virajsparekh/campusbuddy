import React from 'react';
import Button from '@mui/material/Button';

const PrimaryButton = ({
  children,
  ...rest
}) => (
  <Button
    variant="contained"
    color="primary"
    fullWidth
    sx={{ py: 1.2, fontWeight: 600 }}
    {...rest}
  >
    {children}
  </Button>
);

export default PrimaryButton; 