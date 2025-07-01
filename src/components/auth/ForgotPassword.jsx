import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FormField from '../common/FormField';
import PrimaryButton from '../common/PrimaryButton';
import CampusBuddyLogo from '../common/CampusBuddyLogo';
import '../../styles/ForgotPassword.css';
import Header from '../common/Header';
import Footer from '../common/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setError('');
    setSubmitted(true);
    // TODO: Forgot password logic
    setTimeout(() => setSubmitted(false), 1500);
  };

  return (
    <Box className="forgot-bg" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--cb-bg, #F1F5F9)', zIndex: 1 }}>
      <Header />
      <div className="forgot-card glass">
      <CampusBuddyLogo style={{ height: '200px', width: '260px', margin: 0, padding: 2 }} />
        <Typography className="forgot-title" variant="h5" component="h1" gutterBottom align="center">
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          Enter your email and we'll send you a reset link.
        </Typography>
        <form className="forgot-form" onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={!!error}
            helperText={error}
            name="email"
            autoComplete="email"
            type="email"
            required
          />
          <PrimaryButton className="forgot-btn" type="submit" disabled={submitted} aria-label="Send reset link">
            {submitted ? 'Sending...' : 'Send Reset Link'}
          </PrimaryButton>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Link onClick={() => navigate('/login')} underline="hover" variant="body2">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </Box>
  );
};

export default ForgotPassword; 