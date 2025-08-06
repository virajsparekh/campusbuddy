import React, { useContext } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(AuthContext);
  
  const handleLogout = () => {
    setUser(null, null);
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Box sx={{ 
      width: '100%', 
      bgcolor: '#fff', 
      height: '100vh', 
      p: 3, 
      borderRight: '1px solid #e5e7eb',
      overflowY: 'auto',
      boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography variant="h6" fontWeight={700} color="#6366f1" mb={4}>
        CampusBuddy Admin
      </Typography>
      <List>
        <ListItem 
          component="button"
          onClick={() => handleNavigation('/admin')}
          sx={{ 
            bgcolor: isActive('/admin') ? '#f3f4f6' : 'transparent',
            borderRadius: 1,
            mb: 1,
            border: 'none',
            background: 'none',
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            py: 1.5,
            px: 2
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}><DashboardIcon /></ListItemIcon>
          <ListItemText 
            primary="Dashboard" 
            sx={{ 
              '& .MuiListItemText-primary': {
                fontSize: '0.95rem',
                fontWeight: 500,
                color: '#374151'
              }
            }}
          />
        </ListItem>
        <ListItem 
          component="button"
          onClick={() => handleNavigation('/admin/users')}
          sx={{ 
            bgcolor: isActive('/admin/users') ? '#f3f4f6' : 'transparent',
            borderRadius: 1,
            mb: 1,
            border: 'none',
            background: 'none',
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            py: 1.5,
            px: 2
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}><GroupIcon /></ListItemIcon>
          <ListItemText 
            primary="Manage Users" 
            sx={{ 
              '& .MuiListItemText-primary': {
                fontSize: '0.95rem',
                fontWeight: 500,
                color: '#374151'
              }
            }}
          />
        </ListItem>
        <ListItem 
          component="button"
          onClick={() => handleNavigation('/admin/events')}
          sx={{ 
            bgcolor: isActive('/admin/events') ? '#f3f4f6' : 'transparent',
            borderRadius: 1,
            mb: 1,
            border: 'none',
            background: 'none',
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            py: 1.5,
            px: 2
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}><EventIcon /></ListItemIcon>
          <ListItemText 
            primary="Manage Events" 
            sx={{ 
              '& .MuiListItemText-primary': {
                fontSize: '0.95rem',
                fontWeight: 500,
                color: '#374151'
              }
            }}
          />
        </ListItem>
        <ListItem 
          component="button"
          onClick={() => handleNavigation('/admin/post-event')}
          sx={{ 
            bgcolor: isActive('/admin/post-event') ? '#f3f4f6' : 'transparent',
            borderRadius: 1,
            mb: 1,
            border: 'none',
            background: 'none',
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            py: 1.5,
            px: 2
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}><AddIcon /></ListItemIcon>
          <ListItemText 
            primary="Post Event" 
            sx={{ 
              '& .MuiListItemText-primary': {
                fontSize: '0.95rem',
                fontWeight: 500,
                color: '#374151'
              }
            }}
          />
        </ListItem>
        <Divider sx={{ my: 2 }} />
        <ListItem 
          component="button"
          onClick={handleLogout}
          sx={{ 
            borderRadius: 1,
            border: 'none',
            background: 'none',
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            py: 1.5,
            px: 2,
            '&:hover': {
              bgcolor: '#fee2e2'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon /></ListItemIcon>
          <ListItemText 
            primary="Logout" 
            sx={{ 
              '& .MuiListItemText-primary': {
                fontSize: '0.95rem',
                fontWeight: 500,
                color: '#374151'
              }
            }}
          />
        </ListItem>
      </List>
    </Box>
  );
}
