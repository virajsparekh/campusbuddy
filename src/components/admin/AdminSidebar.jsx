import React, { useContext } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const handleLogout = () => {
    setUser(null, null);
    navigate('/');
  };
  return (
    <Box sx={{ width: 250, bgcolor: '#fff', height: '100vh', p: 3, borderRight: '1px solid #e5e7eb' }}>
      <Typography variant="h6" fontWeight={700} color="#6366f1" mb={4}>
        CampusBuddy Admin
      </Typography>
      <List>
        <ListItem button component="a" href="/admin">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component="a" href="/admin/users">
          <ListItemIcon><GroupIcon /></ListItemIcon>
          <ListItemText primary="Manage Users" />
        </ListItem>
        <ListItem button component="a" href="/admin/post-event">
          <ListItemIcon><EventIcon /></ListItemIcon>
          <ListItemText primary="Post Event" />
        </ListItem>
        <Divider sx={{ my: 2 }} />
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );
}
