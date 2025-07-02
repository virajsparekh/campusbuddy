import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CampusBuddyLogo from '../components/common/CampusBuddyLogo';
import '../styles/Home.css';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
const Home = () => (
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

export default Home; 