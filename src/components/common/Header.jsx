import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link as RouterLink } from 'react-router-dom';
import CampusBuddyLogo from './CampusBuddyLogo';

const HEADER_HEIGHT = 80;

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElStudyHub, setAnchorElStudyHub] = useState(null);
  const [anchorElMarketplace, setAnchorElMarketplace] = useState(null);
  const [anchorElQA, setAnchorElQA] = useState(null);
  const [anchorElSupport, setAnchorElSupport] = useState(null);

  // Open menu on mouse enter
  const handleMouseEnter = (event) => setAnchorEl(event.currentTarget);
  // Close menu on mouse leave (from button or menu)
  const handleMouseLeave = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  return (
    <AppBar position="static" color="inherit" elevation={1} sx={{ mb: 2, height: HEADER_HEIGHT }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: HEADER_HEIGHT, height: HEADER_HEIGHT, px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <RouterLink to="/" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <CampusBuddyLogo style={{ height: '200px', width: '260px', margin: 0, padding: 2 }} />
          </RouterLink>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={RouterLink} to="/" color="primary" sx={{ fontWeight: 600, fontSize: 20 }}>
            Home
          </Button>
          <div
            onMouseEnter={e => setAnchorElStudyHub(e.currentTarget)}
            onMouseLeave={() => setAnchorElStudyHub(null)}
            style={{ display: 'inline-block' }}
          >
            <Button
              color="primary"
              sx={{ fontWeight: 600, textTransform: 'none', fontSize: 20 }}
              aria-controls={Boolean(anchorElStudyHub) ? 'studyhub-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorElStudyHub) ? 'true' : undefined}
            >
              Study Hub
            </Button>
            <Menu
              id="studyhub-menu"
              anchorEl={anchorElStudyHub}
              open={Boolean(anchorElStudyHub)}
              onClose={() => setAnchorElStudyHub(null)}
              MenuListProps={{
                onMouseLeave: () => setAnchorElStudyHub(null),
                'aria-labelledby': 'studyhub-button',
              }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem component={RouterLink} to="/studyhub/browse" onClick={() => setAnchorElStudyHub(null)}>
                Browse Materials
              </MenuItem>
              <MenuItem component={RouterLink} to="/studyhub/upload" onClick={() => setAnchorElStudyHub(null)}>
                Upload Materials
              </MenuItem>
              <MenuItem component={RouterLink} to="/studyhub/myuploads" onClick={() => setAnchorElStudyHub(null)}>
                My Uploads
              </MenuItem>
            </Menu>
          </div>
          <div
            onMouseEnter={e => setAnchorElMarketplace(e.currentTarget)}
            onMouseLeave={() => setAnchorElMarketplace(null)}
            style={{ display: 'inline-block' }}
          >
            <Button
              color="primary"
              sx={{ fontWeight: 600, textTransform: 'none', fontSize: 20 }}
              aria-controls={Boolean(anchorElMarketplace) ? 'marketplace-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorElMarketplace) ? 'true' : undefined}
            >
              Marketplace
            </Button>
            <Menu
              id="marketplace-menu"
              anchorEl={anchorElMarketplace}
              open={Boolean(anchorElMarketplace)}
              onClose={() => setAnchorElMarketplace(null)}
              MenuListProps={{
                onMouseLeave: () => setAnchorElMarketplace(null),
                'aria-labelledby': 'marketplace-button',
              }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem component={RouterLink} to="/marketplace" onClick={() => setAnchorElMarketplace(null)}>
                Browse Listings
              </MenuItem>
              <MenuItem component={RouterLink} to="/marketplace/post" onClick={() => setAnchorElMarketplace(null)}>
                Post Listing
              </MenuItem>
              <MenuItem component={RouterLink} to="/marketplace/mylistings" onClick={() => setAnchorElMarketplace(null)}>
                My Listings
              </MenuItem>
            </Menu>
          </div>
          <Button component={RouterLink} to="/events" color="primary" sx={{ fontWeight: 600, textTransform: 'capitalize', fontSize: 20 }}>
            Events
          </Button>
          <div
            onMouseEnter={e => setAnchorElQA(e.currentTarget)}
            onMouseLeave={() => setAnchorElQA(null)}
            style={{ display: 'inline-block' }}
          >
            <Button
              color="primary"
              sx={{ fontWeight: 600, textTransform: 'none', fontSize: 20 }}
              aria-controls={Boolean(anchorElQA) ? 'qa-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorElQA) ? 'true' : undefined}
            >
              Community Q&A
            </Button>
            <Menu
              id="qa-menu"
              anchorEl={anchorElQA}
              open={Boolean(anchorElQA)}
              onClose={() => setAnchorElQA(null)}
              MenuListProps={{
                onMouseLeave: () => setAnchorElQA(null),
                'aria-labelledby': 'qa-button',
              }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem component={RouterLink} to="/qa/browse" onClick={() => setAnchorElQA(null)}>
                Browse Questions
              </MenuItem>
              <MenuItem component={RouterLink} to="/qa/ask" onClick={() => setAnchorElQA(null)}>
                Post Question
              </MenuItem>
              <MenuItem component={RouterLink} to="/qa/myquestions" onClick={() => setAnchorElQA(null)}>
                My Questions
              </MenuItem>
              <MenuItem component={RouterLink} to="/qa/myanswers" onClick={() => setAnchorElQA(null)}>
                My Answers
              </MenuItem>
            </Menu>
          </div>
          <div
            onMouseEnter={e => setAnchorElSupport(e.currentTarget)}
            onMouseLeave={() => setAnchorElSupport(null)}
            style={{ display: 'inline-block' }}
          >
            <Button
              color="primary"
              sx={{ fontWeight: 600, textTransform: 'none', fontSize: 20 }}
              aria-controls={Boolean(anchorElSupport) ? 'support-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorElSupport) ? 'true' : undefined}
            >
              Support
            </Button>
            <Menu
              id="support-menu"
              anchorEl={anchorElSupport}
              open={Boolean(anchorElSupport)}
              onClose={() => setAnchorElSupport(null)}
              MenuListProps={{
                onMouseLeave: () => setAnchorElSupport(null),
                'aria-labelledby': 'support-button',
              }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem component={RouterLink} to="/support/help" onClick={() => setAnchorElSupport(null)}>
                Help Center
              </MenuItem>
              <MenuItem component={RouterLink} to="/support/contact" onClick={() => setAnchorElSupport(null)}>
                Contact Us
              </MenuItem>
              <MenuItem component={RouterLink} to="/support/terms" onClick={() => setAnchorElSupport(null)}>
                Terms of Service
              </MenuItem>
              <MenuItem component={RouterLink} to="/support/privacy" onClick={() => setAnchorElSupport(null)}>
                Privacy Policy
              </MenuItem>
            </Menu>
          </div>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ display: 'inline-block' }}
          >
            <Button
              color="primary"
              sx={{ fontWeight: 600, textTransform: 'none', fontSize: 20 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              Hello, Sign in
            </Button>
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMouseLeave}
              MenuListProps={{
                onMouseLeave: handleMouseLeave,
                'aria-labelledby': 'account-button',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem component={RouterLink} to="/profile" onClick={handleMouseLeave}>
                My Profile
              </MenuItem>
              <MenuItem component={RouterLink} to="/login" onClick={handleMouseLeave}>
                Login
              </MenuItem>
              <MenuItem component={RouterLink} to="/signup" onClick={handleMouseLeave}>
                Sign Up
              </MenuItem>
            </Menu>
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 