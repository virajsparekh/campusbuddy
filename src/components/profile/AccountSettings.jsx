import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import Header from '../common/Header';
import Footer from '../common/Footer';

const AccountSettings = ({ user }) => {
  if (!user) return null;
  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--cb-bg, #F1F5F9)', zIndex: 1 }}>
      <Header />
      <Card sx={{ maxWidth: 600, width: '100%', borderRadius: 4, boxShadow: 3, p: { xs: 2, sm: 4 }, background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Account Settings</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>Email: {user.email}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Premium: {user.isPremium ? 'Active' : 'Inactive'}</Typography>
          {user.isPremium && user.premiumExpiry && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Premium Expiry: {new Date(user.premiumExpiry).toLocaleDateString()}
            </Typography>
          )}
          <Button variant="contained" color="primary" sx={{ mt: 2, fontWeight: 600 }}>
            Manage Subscription
          </Button>
        </CardContent>
      </Card>
      <Footer />
    </Box>
  );
};

export default AccountSettings;
