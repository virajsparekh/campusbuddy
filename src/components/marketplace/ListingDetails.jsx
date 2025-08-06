import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  Chip, 
  Divider, 
  Alert, 
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Header from '../common/Header';
import { useAuth } from '../../context/AuthContext';

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        setLoading(true);
        setError('');

        

        const response = await fetch(`http://localhost:5001/api/marketplace/listings/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });



        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error('Failed to fetch listing details');
        }

        const data = await response.json();

        setListing(data.listing);
      } catch (err) {
        console.error('Error fetching listing details:', err);
        setError('Failed to load listing details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchListingDetails();
    } else if (!token) {
      setError('Please log in to view listing details');
    }
  }, [id, token]);

  const handleBack = () => {
    navigate('/marketplace');
  };

  const handleContact = () => {
    if (listing?.contactInfo) {
      // For phone numbers, try to open phone app
      if (listing.contactInfo.includes('(') || listing.contactInfo.includes('-')) {
        window.open(`tel:${listing.contactInfo}`, '_blank');
      } else {
        // For email addresses
        window.open(`mailto:${listing.contactInfo}`, '_blank');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
          <Alert severity="error" sx={{ maxWidth: 600 }}>
            {error}
          </Alert>
        </Box>
      </Box>
    );
  }

  if (!listing) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
          <Alert severity="warning" sx={{ maxWidth: 600 }}>
            Listing not found.
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--cb-bg, #F1F5F9)' }}>
      <Header />
      
      {/* Main Content */}
      <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ maxWidth: 1400, width: '100%' }}>
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mb: 3, color: 'primary.main' }}
          >
            Back to Marketplace
          </Button>

          <Grid container spacing={6} className="marketplace-details-container">
            {/* Left Column - Image and Contact Info */}
            <Grid item xs={12} md={5} className="marketplace-details-left">
              {/* Image Card - Bigger size to use more space */}
              <Paper elevation={3} className="marketplace-image" sx={{ 
                borderRadius: 3, 
                overflow: 'hidden', 
                mb: 3,
                width: 400,
                height: 300,
                background: '#f3f4f6', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <img 
                  src={listing.img} 
                  alt={listing.title} 
                  style={{ 
                    width: 400,
                    height: 300,
                    objectFit: 'cover' 
                  }} 
                />
              </Paper>

              {/* Contact Information Card - Same width as image */}
              <Card elevation={2} sx={{ 
                borderRadius: 3,
                width: 400,
                height: 140
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 2 }}>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      {listing.contactInfo}
                    </Typography>
                  </Box>
                  {listing.postedBy?.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        {listing.postedBy.email}
                      </Typography>
                    </Box>
                  )}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleContact}
                    sx={{ mt: 2, fontWeight: 600 }}
                  >
                    Contact Seller
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Details */}
            <Grid item xs={12} md={7} className="marketplace-details-right">
              <Paper elevation={3} sx={{ 
                borderRadius: 3, 
                p: 4,
                width: 500,
                maxWidth: '100%'
              }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h4" fontWeight={700} color="primary">
                      {listing.title}
                    </Typography>
                    {listing.isPriority && (
                      <Chip
                        icon={<StarIcon />}
                        label="Priority Listing"
                        color="warning"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>
                  
                  <Typography variant="h3" fontWeight={700} color="primary" sx={{ mb: 1 }}>
                    ${listing.price}{listing.priceUnit}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1" color="text.secondary">
                      {listing.location}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {listing.description}
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Details */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Category
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {listing.category}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Condition
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {listing.condition}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Type
                      </Typography>
                      <Typography variant="body1" fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                        {listing.type}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Listed
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Seller Information */}
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Posted by
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {listing.postedBy?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {listing.postedBy?.name || 'Unknown User'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Member since {new Date(listing.createdAt).getFullYear()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
} 