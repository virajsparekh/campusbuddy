import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, Stack, Avatar, Grid } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Header from '../common/Header';

const demoEvents = [
  {
    eventId: 'E011',
    title: 'Road Seminar',
    description: 'Lawyer attack simply protect something camera himself.',
    date: '2025-03-27T01:01:57.948166',
    location: '810 Ralph Via, Georgefurt, TN 42292',
    isPremiumOnly: true,
    createdBy: { userId: 'U099', name: 'Thomas Marsh', email: 'dennis85@wiggins.com' },
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    price: 0,
  },
  {
    eventId: 'E012',
    title: 'Tech Innovation Expo',
    description: 'Explore the latest in campus technology and innovation. Demos, talks, and networking.',
    date: '2025-04-10T15:00:00.000Z',
    location: 'Innovation Hall, Main Campus',
    isPremiumOnly: true,
    createdBy: { userId: 'U101', name: 'Priya Singh', email: 'priya@campus.com' },
    category: 'Tech',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    price: 0,
  },
  {
    eventId: 'E013',
    title: 'Spring Music Fest',
    description: 'Live performances by student bands and local artists. Food trucks and games!',
    date: '2025-05-05T18:30:00.000Z',
    location: 'Central Park Amphitheater',
    isPremiumOnly: true,
    createdBy: { userId: 'U102', name: 'Alex Kim', email: 'alex@campus.com' },
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
    price: 10,
  },
  {
    eventId: 'E014',
    title: 'Career Fair 2025',
    description: 'Meet top employers and explore internship and job opportunities. Bring your resume!',
    date: '2025-06-01T10:00:00.000Z',
    location: 'Student Center Ballroom',
    isPremiumOnly: true,
    createdBy: { userId: 'U103', name: 'Jane Doe', email: 'jane@campus.com' },
    category: 'Career',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    price: 0,
  },
  {
    eventId: 'E015',
    title: 'Art & Culture Night',
    description: 'An evening of art exhibits, poetry readings, and cultural performances.',
    date: '2025-06-15T19:00:00.000Z',
    location: 'Arts Building Gallery',
    isPremiumOnly: true,
    createdBy: { userId: 'U104', name: 'Sam Lee', email: 'sam@campus.com' },
    category: 'Culture',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    price: 5,
  },
  {
    eventId: 'E016',
    title: 'Wellness Retreat',
    description: 'Workshops on mindfulness, yoga, and healthy living. Free wellness kits for attendees.',
    date: '2025-07-10T09:00:00.000Z',
    location: 'Lakeside Retreat Center',
    isPremiumOnly: true,
    createdBy: { userId: 'U105', name: 'Emily Chen', email: 'emily@campus.com' },
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
    price: 0,
  },
  {
    eventId: 'E017',
    title: 'Startup Pitch Night',
    description: 'Watch student entrepreneurs pitch their ideas to a panel of judges and investors.',
    date: '2025-08-01T17:00:00.000Z',
    location: 'Business Incubator Auditorium',
    isPremiumOnly: true,
    createdBy: { userId: 'U106', name: 'Michael Brown', email: 'michael@campus.com' },
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    price: 0,
  },
];

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

const allCategories = [
  'All',
  ...Array.from(new Set(demoEvents.map(e => e.category)))
];

export default function BrowseEvents() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const filteredEvents = selectedCategory === 'All'
    ? demoEvents
    : demoEvents.filter(e => e.category === selectedCategory);
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
          <Chip icon={<StarIcon />} label="Premium Only" color="warning" sx={{ fontWeight: 600, fontSize: 15, px: 1.5, py: 0.5, borderRadius: 2, height: 32 }} size="medium" />
        </Stack>
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5%', width: '100%' }}>
          {filteredEvents.map((event, idx) => (
            <Box
              key={event.eventId}
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
                  <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
                    <Chip label={event.category} color={categoryColors[event.category] || 'default'} size="small" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontSize: 13, px: 1.5, py: 0.5, borderRadius: 2 }} />
                    <EventAvailableIcon color="primary" sx={{ ml: 1 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>{formatDate(event.date)} • {formatTime(event.date)}</Typography>
                  </Stack>
                  <Typography variant="h6" fontWeight={700} color="#111827" mb={1}>{event.title}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>{event.description}</Typography>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <LocationOnIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>{event.location}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <Avatar src={`https://api.dicebear.com/7.x/initials/svg?seed=${event.createdBy.name}`} sx={{ width: 28, height: 28 }} />
                    <Typography variant="body2" color="text.secondary">By <b>{event.createdBy.name}</b></Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {event.price > 0 ? (
                      <Chip icon={<AttachMoneyIcon />} label={`$${event.price}`} color="success" size="small" sx={{ fontWeight: 600 }} />
                    ) : (
                      <Chip label="Free" color="primary" size="small" sx={{ fontWeight: 600 }} />
                    )}
                  </Stack>
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="warning.main" fontWeight={600}>
            These events are exclusive to premium members. Upgrade to premium to unlock all features!
          </Typography>
        </Box>
      </Box>
    </Box>
  );
} 