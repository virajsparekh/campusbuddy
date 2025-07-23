import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ requiredRole, requirePremium, children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }
  if (user.isBlocked) {
    alert('You are blocked. Please contact the team.');
    return <Navigate to="/blocked" />;
  }
  if (requiredRole && user.role !== requiredRole) {
    alert('You are not authorized to access this page.');
    return <Navigate to="/dashboard" />;
  }
  if (requirePremium) {
    const isPremium = user.isPremium;
    const expiry = user.premiumExpiry ? new Date(user.premiumExpiry) : null;
    const now = new Date();
    if (!isPremium || !expiry || expiry < now) {
      return <Navigate to="/subscription" state={{ message: 'This page is for premium users only. Please subscribe or renew your premium membership.' }} />;
    }
  }
  return children;
};

export default ProtectedRoute; 