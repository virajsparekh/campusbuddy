import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, List, ListItem, ListItemIcon, ListItemText, Divider, Paper, Grid, Alert, CircularProgress } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StarIcon from '@mui/icons-material/Star';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../common/Header';
import { marketplaceAPI } from '../../services/marketplaceAPI';

const categories = [
  { label: 'Accommodation', icon: <HomeIcon /> },
  { label: 'Electronics', icon: <LocalOfferIcon /> },
  { label: 'Books', icon: <LocalOfferIcon /> },
  { label: 'Furniture', icon: <LocalOfferIcon /> },
  { label: 'Other', icon: <LocalOfferIcon /> },
];

export default function BrowseListings() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch listings from API
  useEffect(() => {
    fetchListings();
  }, [selectedCategory]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== undefined) {
        fetchListings();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const filters = {};
      
      if (selectedCategory !== 'All') {
        // Map category names to API filters
        if (selectedCategory === 'Accommodation') {
          filters.type = 'accommodation';
        } else {
          filters.category = selectedCategory;
        }
      }
      
      if (search) {
        filters.search = search;
      }

      const data = await marketplaceAPI.getListings(filters);
      setListings(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load listings. Please try again.');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to match the existing component structure
  const transformListing = (listing) => ({
    id: listing._id,
    type: listing.type === 'accommodation' ? 'Accommodation' : 'Item',
    title: listing.title,
    location: listing.location || listing.address || 'Location not specified',
    price: listing.price || listing.rent,
    priceUnit: listing.type === 'accommodation' ? '/mo' : '',
    img: listing.image || `https://images.unsplash.com/photo-150674403813${Math.floor(Math.random() * 10)}-46273834b3fb?auto=format&fit=crop&w=400&q=80`,
    category: listing.category || 'Accommodation',
    description: listing.description,
    userId: listing.userId,
    createdAt: listing.createdAt,
    priority: listing.priority
  });

  const transformedListings = listings.map(transformListing);

  return (
    <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw' }}>
      <Header />
      <Alert
        severity="info"
        sx={{ 
          width: '90%', 
          maxWidth: 1200, 
          mt: 2, 
          mb: 2, 
          borderRadius: 2,
          '& .MuiAlert-message': { width: '100%' }
        }}
        action={
          <Button 
            size="small" 
            sx={{ 
              color: '#F59E0B',
              fontWeight: 600,
              '&:hover': { background: '#f3f4f6' }
            }}
          >
            Upgrade Now
          </Button>
        }
      >
        <Typography variant="body1" fontWeight={600}>
          Get priority listings and premium features! Upgrade to Premium for better visibility and exclusive benefits.
        </Typography>
      </Alert>
      <Box sx={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', background: 'var(--cb-bg, #F1F5F9)' }}>
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
                <ListItemIcon>
                  {React.cloneElement(cat.icon, { color: selectedCategory === cat.label ? 'primary' : 'action' })}
                </ListItemIcon>
                <ListItemText primary={cat.label} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Button
            component={RouterLink}
            to="/marketplace/post"
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            fullWidth
            sx={{ fontWeight: 700, borderRadius: 2, mb: 1 }}
          >
            Create new listing
          </Button>
          <Button
            component={RouterLink}
            to="/marketplace/my-listings"
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ fontWeight: 700, borderRadius: 2 }}
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
            <Typography variant="h5" fontWeight={700} mb={2} color="#2563EB">
              {selectedCategory === 'All' ? "Today's picks" : `${selectedCategory} Listings`}
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', maxWidth: 1200, mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ width: '100%', maxWidth: 1200 }}>
              {transformedListings.length === 0 ? (
                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" mb={1}>
                      No listings found
                    </Typography>
                    <Typography color="text.secondary">
                      {search ? 'Try adjusting your search terms.' : 'Be the first to post a listing!'}
                    </Typography>
                  </Paper>
                </Grid>
              ) : (
                transformedListings.map(listing => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
                    <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 8 } }}>
                      {listing.priority && (
                        <Box sx={{ 
                          background: 'linear-gradient(45deg, #FFD700, #FFA500)', 
                          color: 'white', 
                          p: 0.5, 
                          textAlign: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          ⭐ PRIORITY LISTING
                        </Box>
                      )}
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
                        <Typography color="text.secondary" sx={{ fontSize: 12, mt: 1, opacity: 0.7 }}>
                          {listing.type} • {new Date(listing.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
}
