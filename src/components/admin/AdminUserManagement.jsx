import React, { useState, useEffect } from 'react';
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
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Pagination,
  TextField as MuiTextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AdminLayout from './AdminLayout'; 
import { getApiUrl } from '../../utils/api';

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: '', college: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const searchParam = searchTerm ? `&search=${searchTerm}` : '';
      const response = await fetch(getApiUrl(`/api/admin/users?page=${page}&limit=10${searchParam}`), {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (user = null) => {
    setEditUser(user);
    setForm(user ? { 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      college: user.college?.name || '' 
    } : { name: '', email: '', role: '', college: '' });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Prepare update data
      const updateData = {
        name: form.name,
        role: form.role
      };
      
      // Add college data if it's provided
      if (form.college) {
        updateData.college = {
          name: form.college,
          province: editUser?.college?.province || 'Ontario',
          type: editUser?.college?.type || 'College',
          _id: editUser?.college?._id || '64a1b0f845aabb11aa000008'
        };
      }
      

      
      const response = await fetch(getApiUrl(`/api/admin/users/${editUser._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(updateData)
      });
      
      
      
      if (response.ok) {
        const responseData = await response.json();
        
        fetchUsers(); 
        setOpen(false);
        setError(null);
        setSuccess('User updated successfully!');
        setTimeout(() => setSuccess(null), 3000); 
      } else {
        const data = await response.json();
        
        setError(data.msg || 'Failed to update user');
      }
          } catch (err) {
      setError('Error updating user');
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isBlocked ? 'unblock' : 'block';
      const response = await fetch(getApiUrl(`/api/admin/users/${userId}/${endpoint}`), {
        method: 'PATCH',
        headers: {
          'x-auth-token': token
        }
      });
      
      if (response.ok) {
        fetchUsers(); 
      } else {
        setError('Failed to update user status');
      }
    } catch (err) {
      setError('Error updating user status');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ 
          p: 4, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh'
        }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ p: 4 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" fontWeight={700} color="#2563EB">
                User Management
              </Typography>
            </Box>

            {/* Search Bar */}
            <MuiTextField
              fullWidth
              label="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="Search by name, email, or student ID..."
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>College</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role} 
                          color={user.role === 'admin' ? 'error' : 'primary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.college?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.isBlocked ? 'Blocked' : 'Active'} 
                          color={user.isBlocked ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpen(user)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleBlockUser(user._id, user.isBlocked)}
                          color={user.isBlocked ? 'success' : 'error'}
                        >
                          {user.isBlocked ? <CheckCircleIcon /> : <BlockIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
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
                select
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </TextField>
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
    </AdminLayout>
  );
}
