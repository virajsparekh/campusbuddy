import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FormField from '../common/FormField';
import PrimaryButton from '../common/PrimaryButton';
import CampusBuddyLogo from '../common/CampusBuddyLogo';
import Header from '../common/Header';
import Footer from '../common/Footer';
import '../../styles/Login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', errors: {} });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
      errors: { ...prev.errors, [field]: undefined }
    }));
  };

  const validate = () => {
    const errors = {};
    if (!form.email.trim()) errors.email = 'Email is required';
    if (!form.password.trim()) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setForm((prev) => ({ ...prev, errors }));
      return;
    }
    setSubmitting(true);
    // TODO: Login logic
    setTimeout(() => setSubmitting(false), 1000);
  };

  return (
    <Box
      className="login-bg"
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--cb-bg, #F1F5F9)'
      }}
    >
      <Header />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 6
        }}
      >
        <div className="login-card glass">
          <CampusBuddyLogo style={{ height: '200px', width: '260px', margin: 0, padding: 2 }} />
          <Typography className="login-title" variant="h5" component="h1" gutterBottom>
            Welcome Back
          </Typography>
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <FormField
              label="Email"
              value={form.email}
              onChange={handleChange('email')}
              error={!!form.errors.email}
              helperText={form.errors.email}
              name="email"
              autoComplete="email"
              type="email"
              required
            />
            <FormField
              label="Password"
              value={form.password}
              onChange={handleChange('password')}
              error={!!form.errors.password}
              helperText={form.errors.password}
              name="password"
              autoComplete="current-password"
              type="password"
              required
            />
            <div className="login-links">
              <Link onClick={() => navigate('/forgot-password')} underline="hover" variant="body2">
                Forgot password?
              </Link>
              <Link onClick={() => navigate('/signup')} underline="hover" variant="body2">
                Sign Up
              </Link>
            </div>
            <PrimaryButton className="login-btn" type="submit" disabled={submitting} aria-label="Login">
              {submitting ? 'Logging in...' : 'Login'}
            </PrimaryButton>
          </form>
        </div>
      </Box>

      <Footer
        sx={{
          textAlign: 'center',
          py: 2,
          backgroundColor: '#f5f5f5'
        }}
      />
    </Box>
  );
};

export default Login;
