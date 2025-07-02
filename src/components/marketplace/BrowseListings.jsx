import React, { useState } from 'react';
import { Box, Typography, Button, TextField, List, ListItem, ListItemIcon, ListItemText, Divider, Paper, Grid } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../common/Header';
const demoListings = [
  {
    id: 1,
    type: 'Accommodation',
    title: 'Spacious 2BHK near Campus',
    location: 'Greenwood Apartments, Block B',
    price: 500,
    priceUnit: '/mo',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    category: 'Accommodation',
  },
  {
    id: 2,
    type: 'Accommodation',
    title: 'Single Room for Girls',
    location: 'Sunrise Hostel, Sector 12',
    price: 250,
    priceUnit: '/mo',
    img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80',
    category: 'Accommodation',
  },
  {
    id: 3,
    type: 'Item',
    title: 'Used Laptop - Dell XPS 13',
    location: 'Near Campus',
    price: 350,
    priceUnit: '',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    category: 'Electronics',
  },
  {
    id: 4,
    type: 'Item',
    title: 'Bicycle for Sale',
    location: 'Campus Parking',
    price: 80,
    priceUnit: '',
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    category: 'Other',
  },
];

const categories = [
  { label: 'Electronics', icon: <LocalOfferIcon /> },
  { label: 'Furniture', icon: <LocalOfferIcon /> },
  { label: 'Books', icon: <LocalOfferIcon /> },
  { label: 'Other', icon: <LocalOfferIcon /> },
  { label: 'Accommodation', icon: <HomeIcon /> },
];

export default function BrowseListings() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  let filtered = demoListings;
  if (selectedCategory !== 'All') {
    filtered = filtered.filter(l => l.category === selectedCategory);
  }
  if (search.trim()) {
    const s = search.trim().toLowerCase();
    filtered = filtered.filter(l =>
      l.title.toLowerCase().includes(s) ||
      l.location.toLowerCase().includes(s)
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--cb-bg, #F1F5F9), align,', width: '100vw' }}>
      <Header />
      <Box sx={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', background: 'var(--cb-bg, #F1F5F9), align,' }}>
      <Box sx={{ width: 280, minWidth: 220, background: '#fff', borderRight: '1px solid #e5e7eb', p: 3, display: { xs: 'none', md: 'block' } }}>
        <Typography variant="h6" fontWeight={700} mb={2} color="#2563EB">Campusbuddy Marketplace</Typography>
        <TextField
          variant="outlined"
          placeholder="Search Marketplace"
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          fullWidth
          sx={{ mb: 2 }}
        />
        <List>
          <ListItem button selected={selectedCategory === 'All'} onClick={() => setSelectedCategory('All')}>
            <ListItemIcon><LocalOfferIcon color={selectedCategory === 'All' ? 'primary' : 'action'} /></ListItemIcon>
            <ListItemText primary="Browse All" />
          </ListItem>
          {categories.map(cat => (
            <ListItem button key={cat.label} selected={selectedCategory === cat.label} onClick={() => setSelectedCategory(cat.label)}>
              <ListItemIcon>{cat.icon}</ListItemIcon>
              <ListItemText primary={cat.label} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          fullWidth
          sx={{ fontWeight: 700, borderRadius: 2, mb: 1 }}
          onClick={() => window.location.href = '/marketplace/post'}
        >
          Create new listing
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ fontWeight: 700, borderRadius: 2 }}
          onClick={() => window.location.href = '/marketplace/mylistings'}
        >
          My Listings
        </Button>
        <Button component={RouterLink} to="/support/help" size="small" sx={{ mt: 2, color: 'primary.main', textTransform: 'none', fontWeight: 500 }}>
          Need help? Visit Help Center
        </Button>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
          North York, Ontario • Within 40 km
        </Typography>
      </Box>
      {/* Main Content */}
      <Box sx={{ flex: 1, p: { xs: 2, md: 5 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 1200, mb: 2 }}>
          <Typography variant="h5" fontWeight={700} mb={2} color="#2563EB">Today's picks</Typography>
        </Box>
        <Grid container spacing={3} sx={{ width: '100%', maxWidth: 1200 }}>
          {filtered.map(listing => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
              <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 8 } }}>
                <Box sx={{ width: '100%', height: 180, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src={listing.img} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" fontWeight={700} color="#2563EB" sx={{ fontSize: 18, mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {listing.title}
                  </Typography>
                  <Typography color="text.primary" fontWeight={600} sx={{ fontSize: 16, mb: 0.5 }}>
                    ${listing.price}{listing.priceUnit}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {listing.location}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      </Box>
    </Box>
  );
} 