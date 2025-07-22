import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Collapse from '@mui/material/Collapse';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link as RouterLink } from 'react-router-dom';
import CampusBuddyLogo from './CampusBuddyLogo';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const HEADER_HEIGHT = 80;

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElStudyHub, setAnchorElStudyHub] = useState(null);
  const [anchorElMarketplace, setAnchorElMarketplace] = useState(null);
  const [anchorElQA, setAnchorElQA] = useState(null);
  const [anchorElSupport, setAnchorElSupport] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openStudyHub, setOpenStudyHub] = useState(false);
  const [openMarketplace, setOpenMarketplace] = useState(false);
  const [openQA, setOpenQA] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Open menu on mouse enter
  const handleMouseEnter = (event) => setAnchorEl(event.currentTarget);
  // Close menu on mouse leave (from button or menu)
  const handleMouseLeave = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  // Sidebar menu structure
  const sidebarMenu = [
    { label: 'Home', to: '/' },
    {
      label: 'Study Hub',
      children: [
        { label: 'Browse Materials', to: '/studyhub/browse' },
        { label: 'Upload Materials', to: '/studyhub/upload' },
        { label: 'My Uploads', to: '/studyhub/myuploads' },
      ],
      open: openStudyHub,
      setOpen: setOpenStudyHub,
    },
    {
      label: 'Marketplace',
      children: [
        { label: 'Browse Listings', to: '/marketplace' },
        { label: 'Post Listing', to: '/marketplace/post' },
        { label: 'My Listings', to: '/marketplace/mylistings' },
      ],
      open: openMarketplace,
      setOpen: setOpenMarketplace,
    },
    { label: 'Events', to: '/events', isSpecial: true },
    {
      label: 'Community Q&A',
      children: [
        { label: 'Browse Questions', to: '/qa/browse' },
        { label: 'Post Question', to: '/qa/ask' },
        { label: 'My Questions', to: '/qa/myquestions' },
        { label: 'My Answers', to: '/qa/myanswers' },
      ],
      open: openQA,
      setOpen: setOpenQA,
    },
    {
      label: 'Support',
      children: [
        { label: 'Help Center', to: '/support/help' },
        { label: 'Contact Us', to: '/support/contact' },
        { label: 'Terms of Service', to: '/support/terms' },
        { label: 'Privacy Policy', to: '/support/privacy' },
      ],
      open: openSupport,
      setOpen: setOpenSupport,
    },
    { label: 'Hello, Sign in', to: '/login' },
  ];

  return (
    <AppBar position="static" color="inherit" elevation={1} sx={{ mb: 2, height: HEADER_HEIGHT }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: HEADER_HEIGHT, height: HEADER_HEIGHT, px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <RouterLink to="/" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <CampusBuddyLogo style={{ height: '200px', width: '260px', margin: 0, padding: 2 }} />
          </RouterLink>
        </Box>
        {isMobile ? (
          <>
            <IconButton edge="end" color="primary" onClick={() => setDrawerOpen(true)}>
              <MenuIcon sx={{ fontSize: 36 }} />
            </IconButton>
            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <Box sx={{ width: 270, pt: 2 }} role="presentation" onClick={() => setDrawerOpen(false)}>
                <List>
                  {sidebarMenu.map((item, idx) =>
                    item.children ? (
                      <React.Fragment key={item.label}>
                        <ListItem button onClick={e => { e.stopPropagation(); item.setOpen(!item.open); }}>
                          <ListItemText primary={item.label} />
                          {item.open ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={item.open} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            {item.children.map(child => (
                              <ListItem button key={child.label} component={RouterLink} to={child.to} sx={{ pl: 4 }}>
                                <ListItemText primary={child.label} />
                              </ListItem>
                            ))}
                          </List>
                        </Collapse>
                      </React.Fragment>
                    ) : (
                      <ListItem button key={item.label} component={RouterLink} to={item.to}>
                        <ListItemText primary={item.label} />
                      </ListItem>
                    )
                  )}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
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
            <Button
              component={RouterLink}
              to="/events"
              sx={{
                fontWeight: 600,
                fontSize: 20,
                background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
                color: 'white',
                borderRadius: 2,
                px: 2.5,
                py: 1,
                boxShadow: 2,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #D97706 0%, #EA580C 100%)',
                  color: 'white',
                },
              }}
            >
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
                Hello , Sign in
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
                <MenuItem component={RouterLink} to="/subscription" onClick={handleMouseLeave}>
                  Subcription
                </MenuItem>
              </Menu>
            </div>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 