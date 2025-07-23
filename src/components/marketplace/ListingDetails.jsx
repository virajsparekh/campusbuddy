import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Button, 
  Chip, 
  CircularProgress, 
  Alert,
  Divider,
  Grid,
  Card,
  CardMedia,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Header from '../common/Header';
import { marketplaceAPI } from '../../services/marketplaceAPI';
import { AuthContext } from '../../context/AuthContext';

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debug logging
  useEffect(() => {
    console.log('ListingDetails mounted:', { id, user: !!user });
  }, [id, user]);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) {
        setError('No listing ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching listing with ID:', id);
        setLoading(true);
        setError('');
        const data = await marketplaceAPI.getListing(id);
        console.log('Listing data received:', data);
        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        setError(error.message || 'Failed to fetch listing details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleBackToMyListings = () => {
    navigate('/marketplace/my-listings');
  };

  const handleContactSeller = () => {
    // TODO: Implement contact functionality
    alert('Contact seller functionality will be implemented soon!');
  };

  if (loading) {
    return (
      <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw' }}>
        <Header />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh'
        }}>
          <CircularProgress size={50} />
        </Box>
      </Box>
    );
  }

  if (error || !listing) {
    return (
      <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw' }}>
        <Header />
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh'
        }}>
          <Alert severity="error" sx={{ maxWidth: 600 }}>
            {error || 'Listing not found'}
          </Alert>
        </Box>
      </Box>
    );
  }

  const isOwner = user && listing.userId && (listing.userId._id === user._id || listing.userId === user._id);

  return (
    <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw' }}>
      <Header />
      <Box sx={{ width: '100%', maxWidth: 1200, py: { xs: 2, md: 3 }, px: 3 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3, color: '#2563EB', fontWeight: 600 }}
        >
          Back to Listings
        </Button>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Image Section */}
            <Paper elevation={0} sx={{ 
              borderRadius: 3, 
              overflow: 'hidden', 
              mb: 3,
              boxShadow: '0 2px 12px 0 rgba(37,99,235,0.08)',
              border: '1px solid #e5e7eb'
            }}>
              {listing.image ? (
                <CardMedia
                  component="img"
                  sx={{ 
                    height: { xs: 300, md: 400 },
                    objectFit: 'cover'
                  }}
                  image={listing.image}
                  alt={listing.title}
                />
              ) : (
                <Box sx={{ 
                  height: { xs: 300, md: 400 },
                  background: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography variant="h6" color="text.secondary">
                    No Image Available
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* Details Section */}
            <Paper elevation={0} sx={{ 
              borderRadius: 3, 
              p: 4,
              boxShadow: '0 2px 12px 0 rgba(37,99,235,0.08)',
              border: '1px solid #e5e7eb'
            }}>
              {/* Title and Priority */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h4" fontWeight={700} color="text.primary">
                    {listing.title}
                  </Typography>
                  {listing.priority && (
                    <Chip 
                      icon={<StarIcon />}
                      label="Priority Listing" 
                      color="warning" 
                      variant="filled"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Box>
                
                {/* Price/Rent */}
                <Typography variant="h5" color="#2563EB" fontWeight={700} sx={{ mb: 2 }}>
                  {listing.type === 'item' 
                    ? formatPrice(listing.price)
                    : `${formatPrice(listing.rent)}/month`
                  }
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {listing.description}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Listing Details */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                  Details
                </Typography>
                
                <Grid container spacing={2}>
                  {/* Type-specific details */}
                  {listing.type === 'item' ? (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CategoryIcon color="primary" />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Category
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {listing.category}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon color="primary" />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Location
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {listing.location}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <HomeIcon color="primary" />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Address
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {listing.address}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      {listing.amenities && listing.amenities.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Amenities
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {listing.amenities.map((amenity, index) => (
                              <Chip 
                                key={index} 
                                label={amenity} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Grid>
                      )}
                    </>
                  )}
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Posted on
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {formatDate(listing.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Seller Info */}
            <Paper elevation={0} sx={{ 
              borderRadius: 3, 
              p: 3,
              boxShadow: '0 2px 12px 0 rgba(37,99,235,0.08)',
              border: '1px solid #e5e7eb',
              mb: 3
            }}>
              <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                Seller Information
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar 
                  sx={{ width: 50, height: 50 }}
                  src={listing.userId?.profilePicture}
                >
                  {listing.userId?.name?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    {listing.userId?.name || 'Unknown User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Campus Buddy Member
                  </Typography>
                </Box>
              </Box>

              {isOwner && (
                <Box sx={{ mb: 2 }}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    This is your listing
                  </Alert>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleBackToMyListings}
                    sx={{
                      fontWeight: 600,
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: '#2563EB',
                      color: '#2563EB',
                      '&:hover': { borderColor: '#1e40af', background: '#f8fafc' }
                    }}
                  >
                    View All My Listings
                  </Button>
                </Box>
              )}

              {!isOwner && (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleContactSeller}
                  sx={{
                    fontWeight: 700,
                    py: 1.5,
                    borderRadius: 2,
                    background: '#2563EB',
                    '&:hover': { background: '#1e40af' }
                  }}
                >
                  Contact Seller
                </Button>
              )}
            </Paper>

            {/* Quick Stats */}
            <Paper elevation={0} sx={{ 
              borderRadius: 3, 
              p: 3,
              boxShadow: '0 2px 12px 0 rgba(37,99,235,0.08)',
              border: '1px solid #e5e7eb'
            }}>
              <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                Listing Stats
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Type:</Typography>
                  <Typography fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                    {listing.type}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Status:</Typography>
                  <Chip 
                    label={listing.isActive ? 'Active' : 'Inactive'} 
                    color={listing.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Listed:</Typography>
                  <Typography fontWeight={600}>
                    {formatDate(listing.createdAt)}
                  </Typography>
                </Box>
                
                {listing.updatedAt !== listing.createdAt && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Updated:</Typography>
                    <Typography fontWeight={600}>
                      {formatDate(listing.updatedAt)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
