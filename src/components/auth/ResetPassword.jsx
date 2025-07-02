import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FormField from '../common/FormField';
import PrimaryButton from '../common/PrimaryButton';
import CampusBuddyLogo from '../common/CampusBuddyLogo';
import Header from '../common/Header';
import Footer from '../common/Footer';
import '../../styles/ResetPassword.css';

const ResetPassword = () => {
  const [form, setForm] = useState({ password: '', confirm: '', errors: {} });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value, errors: { ...prev.errors, [field]: undefined } }));
  };

  const validate = () => {
    const errors = {};
    if (!form.password.trim()) errors.password = 'Password is required';
    if (!form.confirm.trim()) errors.confirm = 'Please confirm your password';
    if (form.password && form.confirm && form.password !== form.confirm) errors.confirm = 'Passwords do not match';
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
    // TODO: Reset password logic
    setTimeout(() => setSubmitting(false), 1000);
  };

  return (
    <Box className="reset-bg">
      <Header />
      <div className="reset-card glass">
      <CampusBuddyLogo style={{ height: '200px', width: '260px', margin: 0, padding: 2 }} />
        <Typography className="reset-title" variant="h5" component="h1" gutterBottom align="center">
          Reset Password
        </Typography>
        <form className="reset-form" onSubmit={handleSubmit} noValidate>
          <FormField
            label="New Password"
            value={form.password}
            onChange={handleChange('password')}
            error={!!form.errors.password}
            helperText={form.errors.password}
            name="password"
            autoComplete="new-password"
            type="password"
            required
          />
          <FormField
            label="Confirm Password"
            value={form.confirm}
            onChange={handleChange('confirm')}
            error={!!form.errors.confirm}
            helperText={form.errors.confirm}
            name="confirm"
            autoComplete="new-password"
            type="password"
            required
          />
          <PrimaryButton className="reset-btn" type="submit" disabled={submitting} aria-label="Reset password">
            {submitting ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword; 