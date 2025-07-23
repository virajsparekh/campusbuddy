import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardMedia, CardContent, Button, Avatar, TextField, IconButton, Stack, Divider, Tooltip, Paper, CircularProgress, Alert } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ShareIcon from '@mui/icons-material/Share';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ViewListIcon from '@mui/icons-material/ViewList';
import AppsIcon from '@mui/icons-material/Apps';  
import Header from '../common/Header';
import { marketplaceAPI } from '../../services/marketplaceAPI';
import { AuthContext } from '../../context/AuthContext';

export default function MyListings() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's listings
  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const data = await marketplaceAPI.getMyListings();
      setListings(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching my listings:', error);
      setError('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  // Transform real listing data to display format
  const transformListing = (listing) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    return {
      id: listing._id,
      title: listing.title,
      price: listing.type === 'item' ? listing.price : listing.rent,
      image: listing.image || 'https://images.unsplash.com/photo-1586509114218-61c7e5b6be09?auto=format&fit=crop&w=400&q=80', // Default image
      status: listing.isActive ? 'Active' : 'Inactive',
      date: formatDate(listing.createdAt),
      clicks: 0, // Default since we don't track clicks yet
      type: listing.type,
      description: listing.description,
      location: listing.location,
      address: listing.address,
      priority: listing.priority
    };
  };

  const handleListingClick = (listingId) => {
    console.log('Navigating to listing from MyListings:', listingId);
    navigate(`/marketplace/listing/${listingId}`);
  };

  const transformedListings = listings.map(transformListing);
  const filtered = transformedListings.filter(l =>
    l.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Header />
      <Box sx={{ width: '100%', maxWidth: 1200, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 8 }}>
        <Box sx={{ flex: 1, maxWidth: 650, mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={5} mb={4}>
            <Typography variant="h5" fontWeight={700} sx={{ color: '#111827' }}>Your listings</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Search your listings"
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ background: '#fff', borderRadius: 2, minWidth: 260 }}
                InputProps={{ sx: { fontSize: 16 } }}
              />
            </Box>
          </Stack>
          <Stack spacing={2}>
            {filtered.map(listing => (
              <Card 
                key={listing.id} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  p: 2, 
                  borderRadius: 4, 
                  boxShadow: 2, 
                  background: '#fff',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 4 }
                }}
                onClick={() => handleListingClick(listing.id)}
              >
                <CardMedia
                  component="img"
                  image={listing.image}
                  alt={listing.title}
                  sx={{ width: 120, height: 90, borderRadius: 2, objectFit: 'cover', mr: 2 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {listing.priority && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <RocketLaunchIcon color="warning" fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="warning.main" fontWeight={600} sx={{ mr: 1 }}>
                        Priority Listing
                      </Typography>
                    </Box>
                  )}
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#111827', mb: 0.5, lineHeight: 1.2 }}>
                    {listing.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#111827', fontSize: 18 }}>
                      ${listing.price}{listing.type === 'accommodation' ? '/mo' : ''}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {listing.status} • Listed on {listing.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {listing.description.length > 100 ? listing.description.substring(0, 100) + '...' : listing.description}
                  </Typography>
                  {listing.location && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      📍 {listing.location}
                    </Typography>
                  )}
                  {listing.address && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      📍 {listing.address}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Listed on Marketplace • {listing.clicks} clicks on listing <InfoOutlinedIcon sx={{ fontSize: 16, verticalAlign: 'middle', ml: 0.5 }} color="disabled" />
                  </Typography>
                  <Stack direction="row" spacing={1} onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      sx={{ fontWeight: 600, borderRadius: 2, minWidth: 120 }}
                      onClick={() => handleListingClick(listing.id)}
                    >
                      View Details
                    </Button>
                    <Button variant="contained" color="primary" sx={{ fontWeight: 600, borderRadius: 2, minWidth: 120 }}>
                      Mark as sold
                    </Button>
                    <Button variant="outlined" color="primary" startIcon={<RocketLaunchIcon />} sx={{ fontWeight: 600, borderRadius: 2, minWidth: 120 }}>
                      Boost listing
                    </Button>
                    <Button variant="outlined" color="primary" startIcon={<ShareIcon />} sx={{ fontWeight: 600, borderRadius: 2, minWidth: 100 }}>
                      Share
                    </Button>
                    <IconButton><MoreHorizIcon /></IconButton>
                  </Stack>
                </Box>
              </Card>
            ))}
          </Stack>
          {filtered.length === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {search ? 'No listings match your search' : 'No listings yet'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {search ? 'Try adjusting your search terms' : 'Start by posting your first listing'}
              </Typography>
              {!search && (
                <Button 
                  variant="contained" 
                  href="/marketplace/post"
                  sx={{ fontWeight: 600, borderRadius: 2 }}
                >
                  Post Your First Listing
                </Button>
              )}
            </Box>
          )}
        </Box>
        <Box sx={{ width: 340, minWidth: 300, display: { xs: 'none', md: 'block' }, alignSelf: 'flex-start' }}>
          <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Avatar src={user?.avatar || 'https://randomuser.me/api/portraits/men/75.jpg'} sx={{ width: 48, height: 48 }} />
              <Box>
                <Typography fontWeight={700}>{user?.name || 'User'}</Typography>
                <Typography variant="body2" color="text.secondary">{transformedListings.length} active listings</Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 1, fontWeight: 700, borderRadius: 2 }}
              href="/marketplace/post"
            >
              + Create new listing
            </Button>
          </Paper>
          <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 3, background: '#F1F5F9' }}>
            <Typography fontWeight={600} mb={1}>Need help?</Typography>
            <Button variant="text" color="primary" sx={{ textTransform: 'none', fontWeight: 600, pl: 0 }}>See all help topics</Button>
          </Paper>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, background: '#F1F5F9' }}>
            <Typography fontWeight={600} mb={1}>Highlight your listing for more visibility</Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Promote your item to appear at the top of search results and reach more students in your campus community.
            </Typography>
            <Typography variant="caption" color="info.main" fontWeight={700}>
              Want to stand out? Try boosting your listing!
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
} 