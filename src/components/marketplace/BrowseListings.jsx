import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/api';
import { Box, Typography, Button, TextField, List, ListItem, ListItemIcon, ListItemText, Divider, Paper, Grid, Alert, CircularProgress, Pagination } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StarIcon from '@mui/icons-material/Star';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import { useAuth } from '../../context/AuthContext';

const categories = [
  { label: 'Accommodation', icon: <HomeIcon /> },
  { label: 'Electronics', icon: <LocalOfferIcon /> },
  { label: 'Books', icon: <LocalOfferIcon /> },
  { label: 'Furniture', icon: <LocalOfferIcon /> },
  { label: 'Other', icon: <LocalOfferIcon /> },
];

export default function BrowseListings() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch listings from API
  const fetchListings = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: currentPage,
        limit: 12
      });

      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }

      if (search.trim()) {
        params.append('search', search.trim());
      }

      

      const response = await fetch(getApiUrl(`/api/marketplace/listings?${params}`), {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fetch listings');
      }

      const data = await response.json();
      
      
      if (data.listings && Array.isArray(data.listings)) {
        setListings(data.listings);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
        
      } else {
        console.error('Invalid data format:', data);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch listings when dependencies change
  useEffect(() => {

    if (token) {
      fetchListings();
    } else {
      
      setError('Please log in to view listings');
    }
  }, [currentPage, selectedCategory, search, token]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); 
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); 
  };

  // Handle card click
  const handleCardClick = (listingId) => {

    navigate(`/marketplace/listing/${listingId}`);
  };

  if (loading && listings.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box className="marketplace-container" sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      background: 'var(--cb-bg, #F1F5F9)', 
      width: '100%',
      overflowX: 'hidden'
    }}>
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
        {/* Sidebar */}
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
            <ListItem button selected={selectedCategory === 'All'} onClick={() => handleCategoryChange('All')}>
              <ListItemIcon><LocalOfferIcon color={selectedCategory === 'All' ? 'primary' : 'action'} /></ListItemIcon>
              <ListItemText primary="Browse All" />
            </ListItem>
            {categories.map(cat => (
              <ListItem button key={cat.label} selected={selectedCategory === cat.label} onClick={() => handleCategoryChange(cat.label)}>
                <ListItemIcon>{cat.icon}</ListItemIcon>
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
        <Box sx={{ 
          flex: 1, 
          p: { xs: 2, md: 5 }, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          overflowX: 'hidden', 
          width: '100%'
        }}>
          <Box sx={{ width: '100%', maxWidth: 1200, mb: 2 }}>
            <Typography variant="h5" fontWeight={700} mb={2} color="#2563EB">
              Today's picks ({totalItems} items)
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={3} sx={{ 
                width: '100%', 
                maxWidth: 1200,
                overflowX: 'hidden', 
                justifyContent: 'center' 
              }}>
                {listings.map(listing => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={listing._id}>
                    <Paper 
                      className="marketplace-card" 
                      elevation={2} 
                      onClick={() => handleCardClick(listing._id)}
                      sx={{ 
                        borderRadius: 3, 
                        overflow: 'hidden', 
                        cursor: 'pointer', 
                        transition: 'box-shadow 0.2s', 
                        '&:hover': { boxShadow: 8 },
                        height: 320,
                        width: 280, 
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Box className="marketplace-image" sx={{ 
                        width: 280, 
                        height: 180, 
                        background: '#f3f4f6', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        overflow: 'hidden'
                      }}>
                        <img src={listing.img} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                      <Box className="marketplace-content" sx={{ 
                        p: 2, 
                        height: 140, 
                        width: 280,
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <Typography variant="h6" fontWeight={700} color="#2563EB" sx={{ 
                          fontSize: 18, 
                          mb: 0.5, 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          lineHeight: 1.2,
                          height: 22 
                        }}>
                          {listing.title}
                        </Typography>
                        <Typography color="text.primary" fontWeight={600} sx={{ 
                          fontSize: 16, 
                          mb: 0.5,
                          lineHeight: 1.2,
                          height: 20 
                        }}>
                          ${listing.price}{listing.priceUnit}
                        </Typography>
                        <Typography color="text.secondary" sx={{ 
                          fontSize: 14, 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          lineHeight: 1.2,
                          mb: 1,
                          height: 18 
                        }}>
                          {listing.location}
                        </Typography>
                        <Box sx={{ height: 40 }} /> {/* Fixed spacer */}
                        {listing.isPriority ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', height: 24 }}>
                            <StarIcon sx={{ color: '#F59E0B', fontSize: 16, mr: 0.5 }} />
                            <Typography variant="caption" color="#F59E0B" fontWeight={600}>
                              Priority Listing
                            </Typography>
                          </Box>
                        ) : (
                          <Box sx={{ height: 24 }} />
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={currentPage} 
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}

              {listings.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No listings found. Try adjusting your search or category filter.
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
