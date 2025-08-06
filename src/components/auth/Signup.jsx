import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { Box, Link, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FormField from '../common/FormField';
import PrimaryButton from '../common/PrimaryButton';
import CampusBuddyLogo from '../common/CampusBuddyLogo';
import Header from '../common/Header';
import Footer from '../common/Footer';
import '../../styles/Signup.css';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    college: '',
    errors: {},
    role: 'student'
  });
  const colleges = [
    { _id: "2d01cab714d11b81ad8224ac", name: "University of Toronto", province: "Ontario", type: "University" },
    { _id: "64a1b0f845aabb11aa000008", name: "Sheridan College", province: "Ontario", type: "College" }
  ];
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
      errors: { ...prev.errors, [field]: undefined },
    }));
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      errors.email = 'Invalid email address';
    }
    if (!form.password.trim()) {
      errors.password = 'Password is required';
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (!form.studentId.trim()) errors.studentId = 'Student ID is required';
    if (!form.college) errors.college = 'Please select your college';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setForm((prev) => ({ ...prev, errors }));
      return;
    }
    setSubmitting(true);
    try {
      const selectedCollege = colleges.find(c => c._id === form.college);
      const collegeObj = selectedCollege
        ? { name: selectedCollege.name, province: selectedCollege.province, type: selectedCollege.type }
        : null;
      const payload = {
        email: form.email,
        password: form.password,
        name: form.name,
        role: form.role,
        college: collegeObj
      };
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSuccess('User created successfully! Redirecting to login...');
        setError('');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        const data = await res.json();
        setError(data.message || data.msg || 'Signup failed');
        setSuccess('');
      }
    } catch (err) {
      setError('Signup failed');
    }
    setSubmitting(false);
  };

  return (
    <Box
      className="signup-bg"
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
        <div className="signup-card glass">
          <CampusBuddyLogo width={260} height={80} style={{ margin: 0, padding: 0 }} />
          <Typography className="signup-title" variant="h5" component="h1" gutterBottom>
            Create your CampusBuddy account
          </Typography>
          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
                <FormField
                  label="Name"
                  value={form.name}
                  onChange={handleChange('name')}
                  error={!!form.errors.name}
                  helperText={form.errors.name}
                  name="name"
                  autoComplete="name"
                  required
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
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
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
                <FormField
                  label="Password"
                  value={form.password}
                  onChange={handleChange('password')}
                  error={!!form.errors.password}
                  helperText={form.errors.password}
                  name="password"
                  autoComplete="new-password"
                  type="password"
                  required
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
                <FormField
                  label="Student ID"
                  value={form.studentId}
                  onChange={handleChange('studentId')}
                  error={!!form.errors.studentId}
                  helperText={form.errors.studentId}
                  name="studentId"
                  required
                />
              </Box>
              <Box sx={{ flex: '1 1 100%' }}>
                <FormControl fullWidth margin="normal" error={!!form.errors.college}>
                  <InputLabel id="college-label">Select College *</InputLabel>
                  <Select
                    labelId="college-label"
                    id="college"
                    value={form.college}
                    label="Select College *"
                    onChange={handleChange('college')}
                    required
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {colleges.map((college) => (
                      <MenuItem key={college._id} value={college._id}>
                        {college.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {form.errors.college && (
                    <Typography variant="caption" color="error">
                      {form.errors.college}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Box>
            <div className="signup-links">
              <Link onClick={() => navigate('/login')} underline="hover" variant="body2">
                Already have an account? Login
              </Link>
            </div>
            <PrimaryButton className="signup-btn" type="submit" disabled={submitting} aria-label="Sign up">
              {submitting ? 'Signing up...' : 'Sign Up'}
            </PrimaryButton>
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
            {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
          </form>
        </div>
      </Box>
      <Footer sx={{ textAlign: 'center', py: 2, backgroundColor: '#f5f5f5' }} />
    </Box>
  );
};

export default Signup;
