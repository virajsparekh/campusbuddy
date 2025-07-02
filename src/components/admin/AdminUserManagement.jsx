import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AdminSidebar from './AdminSidebar'; 

const demoUsers = [
  { id: 1, name: 'Alice Smith', email: 'alice@campusbuddy.com', role: 'student', college: 'Sample College' },
  { id: 2, name: 'Bob Johnson', email: 'bob@campusbuddy.com', role: 'admin', college: 'Sample College' },
  { id: 3, name: 'Carol Lee', email: 'carol@campusbuddy.com', role: 'student', college: 'Sample College' },
];

export default function AdminUserManagement() {
  const [users, setUsers] = useState(demoUsers);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: '', college: '' });

  const handleOpen = (user = null) => {
    setEditUser(user);
    setForm(user ? { ...user } : { name: '', email: '', role: '', college: '' });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (editUser) {
      setUsers(users.map((u) => (u.id === editUser.id ? { ...u, ...form, email: u.email } : u)));
    } else {
      setUsers([...users, { ...form, id: users.length + 1 }]);
    }
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f3f4f6', width: '100vw' }}>
      <AdminSidebar />
      <Box sx={{ flex: 1, p: 4 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" fontWeight={700} color="#2563EB">
                User Management
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                Create User
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>College</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.college}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpen(user)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>

        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
          <DialogTitle>{editUser ? 'Edit User' : 'Create User'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
                disabled={!!editUser}
              />
              <TextField
                label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="College"
                name="college"
                value={form.college}
                onChange={handleChange}
                fullWidth
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
