import React from 'react';
import TextField from '@mui/material/TextField';

const FormField = ({
  label,
  value,
  onChange,
  type = 'text',
  error = false,
  helperText = '',
  ...rest
}) => (
  <TextField
    fullWidth
    label={label}
    value={value}
    onChange={onChange}
    type={type}
    error={error}
    helperText={helperText}
    variant="outlined"
    margin="normal"
    {...rest}
  />
);

export default FormField; 