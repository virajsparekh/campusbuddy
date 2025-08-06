import React, { useState, useContext } from 'react';
import Typography from '@mui/material/Typography';
import { Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FormField from '../common/FormField';
import PrimaryButton from '../common/PrimaryButton';
import CampusBuddyLogo from '../common/CampusBuddyLogo';
import Header from '../common/Header';
import Footer from '../common/Footer';
import '../../styles/Login.css';
import { AuthContext } from '../../context/AuthContext';
import { getApiUrl } from '../../utils/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', errors: {} });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
      errors: { ...prev.errors, [field]: undefined },
    }));
  };

  const validate = () => {
    const errors = {};
    if (!form.email.trim()) errors.email = 'Email is required';
    if (!form.password.trim()) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setForm((prev) => ({ ...prev, errors }));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user, data.token); // Store user and token
        
        // Redirect based on user role
  
        if (data.user && data.user.role === 'admin') {
          
          navigate('/admin'); // Redirect admin users to admin dashboard
        } else {
          
          navigate('/'); // Redirect regular users to home page
        }
      } else {
        const data = await res.json();
        setError(data.msg || 'Login failed');
      }
    } catch (err) {
      setError('Login failed');
    }
    setSubmitting(false);
  };

  return (
    <Box
      className="login-bg"
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--cb-bg, #F1F5F9)',
      }}
    >
      <Header />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 6,
        }}
      >
        <div className="login-card glass">
          <CampusBuddyLogo width={260} height={80} style={{ margin: 0, padding: 0 }} />
          <Typography className="login-title" variant="h5" component="h1" gutterBottom>
            Login to CampusBuddy
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
                Don&apos;t have an account? Sign Up
              </Link>
            </div>
            <PrimaryButton className="login-btn" type="submit" disabled={submitting} aria-label="Login">
              {submitting ? 'Logging in...' : 'Login'}
            </PrimaryButton>
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          </form>
        </div>
      </Box>
      <Footer sx={{ textAlign: 'center', py: 2, backgroundColor: '#f5f5f5' }} />
    </Box>
  );
};

export default Login;
