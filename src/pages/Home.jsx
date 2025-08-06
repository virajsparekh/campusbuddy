import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CampusBuddyLogo from '../components/common/CampusBuddyLogo';
import '../styles/Home.css';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  // Redirect admin users to admin dashboard
  if (user && user.role === 'admin') {

    return <Navigate to="/admin" />;
  }

  if (!user) {
    return (
      <Box className="home-main">
        <Header />
        <Box className="home-hero">
          <div className="home-hero-bg" />
          <div className="home-hero-content">
            <Typography className="home-title" variant="h3" component="h2">
              Welcome to <span className="cb-gradient-text">CampusBuddy</span>
            </Typography>
            <Typography className="home-desc" variant="h6">
              Learn, Connect and Grow with your student community.
            </Typography>
            <div className="home-btns">
              <Button component={RouterLink} to="/login" variant="contained" color="primary" size="large" className="home-btn">
                Login
              </Button>
              <Button component={RouterLink} to="/signup" variant="outlined" color="primary" size="large" className="home-btn">
                Sign Up
              </Button>
            </div>
            <ul className="home-features">
              <li>📚 Access study materials and resources</li>
              <li>🤝 Connect with peers and mentors</li>
              <li>🎉 Join campus events and activities</li>
            </ul>
          </div>
        </Box>
        <Footer />
      </Box>
    );
  }

  // User is logged in: show premium, welcoming message
  return (
    <Box className="home-main">
      <Header />
      <Box className="home-hero" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
            borderRadius: 4,
            boxShadow: 3,
            p: { xs: 4, sm: 6 },
            maxWidth: 500,
            width: '100%',
            textAlign: 'center',
            margin: '0 auto',
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>🌟</div>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back, {user.name.split(' ')[0]}!
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
            Glad to have you as part of the CampusBuddy community.
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            Explore new events, connect with your peers, and make the most of your campus experience.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled', mt: 3 }}>
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Home; 