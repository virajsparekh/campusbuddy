import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Stack, Avatar, Grid, Button, CircularProgress, Alert, Pagination } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Header from '../common/Header';
import { useAuth } from '../../context/AuthContext';

const categoryColors = {
  Business: 'info',
  Tech: 'primary',
  Music: 'secondary',
  Career: 'success',
  Culture: 'warning',
  Wellness: 'success',
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function BrowseEvents() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(12);

  // Fetch events from API
  const fetchEvents = async (page = 1) => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: page,
        limit: itemsPerPage
      });

      const response = await fetch(`http://localhost:5001/api/events?${params}`, {
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
      setCurrentPage(data.pagination.currentPage);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch events on component mount and when page changes
  useEffect(() => {
    if (token) {
      fetchEvents(currentPage);
    }
  }, [token, currentPage]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };

  // Get unique categories from events
  const allCategories = [
    'All',
    ...Array.from(new Set(events.map(e => e.category || 'Other')))
  ];

  // Filter events by selected category
  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(e => (e.category || 'Other') === selectedCategory);

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

  return (
    <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw' }}>
      <Header />
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#ED6C03' }}>
              Premium
            </Typography>
            <Typography variant="h4" fontWeight={700} color="#2563EB">
              Events
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip icon={<StarIcon />} label="Premium Only" color="warning" sx={{ fontWeight: 600, fontSize: 15, px: 1.5, py: 0.5, borderRadius: 2, height: 32 }} size="medium" />
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Tag filter bar */}
        <Stack direction="row" spacing={1} mb={4} flexWrap="wrap" alignItems="center">
          {allCategories.map(cat => (
            <Chip
              key={cat}
              label={cat}
              color={selectedCategory === cat ? 'warning' : 'default'}
              onClick={() => setSelectedCategory(cat)}
              sx={{ fontWeight: 700, fontSize: 15, px: 2, py: 1, borderRadius: 2, cursor: 'pointer', textTransform: 'uppercase' }}
              clickable
            />
          ))}
        </Stack>

        {/* Events count and pagination info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {events.length} of {totalItems} events
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Page {currentPage} of {totalPages}
          </Typography>
        </Box>

        {filteredEvents.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No events found for the selected category.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5%', width: '100%' }}>
            {filteredEvents.map((event, idx) => (
              <Box
                key={event._id || event.eventId}
                sx={{
                  width: { xs: '100%', md: '40%' },
                  minWidth: 340,
                  maxWidth: 480,
                  flex: '0 0 40%',
                  mb: 5,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    borderRadius: 4,
                    p: 0,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    minHeight: 440,
                    maxHeight: 440,
                    width: '100%',
                    boxShadow: '0 4px 24px 0 rgba(37,99,235,0.10)',
                    border: '3px solid #facc15',
                    background: 'linear-gradient(120deg, #fffbe6 0%, #f1f5f9 100%)',
                    position: 'relative',
                    transition: 'transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s cubic-bezier(.4,2,.6,1)',
                    '&:hover': {
                      transform: 'scale(1.025)',
                      boxShadow: '0 8px 32px 0 rgba(37,99,235,0.18)',
                    },
                  }}
                >
                  {/* Cover Image with gradient overlay */}
                  <Box sx={{ height: 220, width: '100%', position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src={event.imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'} 
                      alt={event.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                    />
                    <Box sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.04) 100%)',
                      zIndex: 1,
                    }} />
                    {event.isPremiumOnly && (
                      <Chip icon={<StarIcon />} label="Premium" color="warning" size="small" sx={{ position: 'absolute', top: 18, right: 18, fontWeight: 700, zIndex: 2, background: '#facc15', color: '#fff', px: 1.5, py: 0.5, borderRadius: 2 }} />
                    )}
                  </Box>
                  {/* Event Info */}
                  <Box sx={{ p: 3, pt: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <Chip 
                        label={event.category || 'Other'} 
                        color={categoryColors[event.category] || 'default'} 
                        size="small" 
                        sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontSize: 13, px: 1.5, py: 0.5, borderRadius: 2 }} 
                      />
                      <EventAvailableIcon color="primary" sx={{ ml: 1 }} />
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {formatDate(event.date)} • {formatTime(event.date)}
                      </Typography>
                    </Stack>
                    <Typography variant="h6" fontWeight={700} color="#111827" mb={1}>{event.title}</Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>{event.description}</Typography>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <LocationOnIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>{event.location}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                      <Avatar 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${event.createdBy?.name || 'User'}`} 
                        sx={{ width: 28, height: 28 }} 
                      />
                      <Typography variant="body2" color="text.secondary">
                        By <b>{event.createdBy?.name || 'Unknown'}</b>
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip label="Free" color="primary" size="small" sx={{ fontWeight: 600 }} />
                    </Stack>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Box>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  mx: 0.5,
                },
                '& .Mui-selected': {
                  backgroundColor: '#2563EB',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                  },
                },
              }}
            />
          </Box>
        )}

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="warning.main" fontWeight={600}>
            These events are exclusive to premium members. Upgrade to premium to unlock all features!
          </Typography>
        </Box>
      </Box>
    </Box>
  );
} 