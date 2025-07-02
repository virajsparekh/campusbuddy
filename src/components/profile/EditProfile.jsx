import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, Button, TextField } from '@mui/material';
import Header from '../common/Header';
import Footer from '../common/Footer';

const EditProfile = ({ user, onSave }) => {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: user?.studentId || '',
    college: user?.college?.name || '',
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(form);
  };

  if (!user) return null;
  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--cb-bg, #F1F5F9)', zIndex: 1 }}>
      <Header />
      <Card sx={{ maxWidth: 600, width: '100%', borderRadius: 4, boxShadow: 3, p: { xs: 2, sm: 4 }, background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main', fontSize: 36 }}>
            {user.name.split(' ').map(w => w[0]).join('').slice(0,2)}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Edit Profile</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={handleChange('name')}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={handleChange('email')}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Student ID"
              value={form.studentId}
              onChange={handleChange('studentId')}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="College"
              value={form.college}
              onChange={handleChange('college')}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, fontWeight: 600 }}>
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Footer />
    </Box>
  );
};

export default EditProfile;
