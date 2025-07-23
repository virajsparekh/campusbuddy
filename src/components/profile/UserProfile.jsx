import React, { useContext, useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Avatar, Container, TextField, Stack } from '@mui/material';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { AuthContext } from '../../context/AuthContext';

const initialUser = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  studentId: 'S123456',
  role: 'Student',
  college: { name: 'Sample College', type: 'Public', province: 'Ontario' },
};

export default function UserProfile() {
  const { user, setUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    studentId: user.studentId,
    role: user.role,
    college: user.college.name,
  });

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
      }
    };
    fetchUser();
  }, [setUser]);

  if (!user) return <div>Loading...</div>;

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setForm({
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      role: user.role,
      college: user.college.name,
    });
    setEditing(false);
  };

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      name: form.name,
      email: form.email,
      studentId: form.studentId,
      role: form.role,
      college: { ...user.college, name: form.college },
    });
    setEditing(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: 'var(--cb-bg, #F1F5F9)',
      }}
    >
      <Header />

      <Container maxWidth="sm" sx={{ py: 8, flexGrow: 1 }}>
        <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ width: 90, height: 90, mb: 2, bgcolor: 'primary.main', fontSize: 40 }}>
              {(editing ? form.name : user.name)
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)}
            </Avatar>

            {!editing ? (
              <>
                <Typography variant="h5" fontWeight={700} mb={1} align="center">
                  {user.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={1} align="center">
                  {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={0.5} align="center">
                  Student ID: {user.studentId}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={0.5} align="center">
                  Role: {user.role}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2} align="center">
                  College: {user.college.name} ({user.college.type}, {user.college.province})
                </Typography>
                <Button variant="contained" color="primary" sx={{ fontWeight: 700, mt: 2, px: 4 }} onClick={handleEdit}>
                  EDIT PROFILE
                </Button>
              </>
            ) : (
              <Box
                component="form"
                onSubmit={handleSave}
                sx={{ width: '100%', maxWidth: 350, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
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
                  label="Role"
                  value={form.role}
                  onChange={handleChange('role')}
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
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button variant="contained" color="primary" type="submit" sx={{ fontWeight: 700, px: 3 }}>
                    Save
                  </Button>
                  <Button variant="outlined" color="primary" onClick={handleCancel} sx={{ fontWeight: 700, px: 3 }}>
                    Cancel
                  </Button>
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </Box>
  );
}
