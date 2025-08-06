import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ requiredRole, requirePremium, children }) => {
  const { user, loading, token } = useAuth();

  // Show loading spinner while authentication is being initialized
  if (loading) {

    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // Check if user is authenticated
  if (!user || !token) {

    return <Navigate to="/login" />;
  }
  
  // Check if user is blocked
  if (user.isBlocked) {

    alert('You are blocked. Please contact the team.');
    return <Navigate to="/blocked" />;
  }
  
  // Check role requirements
  if (requiredRole && user.role !== requiredRole) {

    alert('You are not authorized to access this page.');
    return <Navigate to="/dashboard" />;
  }
  
  // Check premium requirements
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