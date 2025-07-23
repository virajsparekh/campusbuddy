import React, { useContext, useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import Header from '../common/Header';
import Footer from '../common/Footer';

const EditProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: user?.studentId || '',
    collegeName: user?.college?.name || '',
    collegeProvince: user?.college?.province || '',
    collegeType: user?.college?.type || ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/user/profile', {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setForm({
          name: data.user.name,
          email: data.user.email,
          studentId: data.user.studentId || '',
          collegeName: data.user.college?.name || '',
          collegeProvince: data.user.college?.province || '',
          collegeType: data.user.college?.type || ''
        });
      }
    };
    fetchUser();
  }, [setUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const college = {
        name: form.collegeName,
        province: form.collegeProvince,
        type: form.collegeType
      };
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ ...form, college })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Profile updated!');
        setUser(data.user);
      } else {
        setError(data.msg || 'Update failed');
      }
    } catch (err) {
      setError('Update failed');
    }
  };

  if (!user) return <div>Loading...</div>;
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
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Student ID"
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="College Name"
              name="collegeName"
              value={form.collegeName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="College Province"
              name="collegeProvince"
              value={form.collegeProvince}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="College Type"
              name="collegeType"
              value={form.collegeType}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, fontWeight: 600 }}>
              Save Changes
            </Button>
          </Box>
          {success && <Typography color="success" sx={{ mt: 2 }}>{success}</Typography>}
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </CardContent>
      </Card>
      <Footer />
    </Box>
  );
};

export default EditProfile;
