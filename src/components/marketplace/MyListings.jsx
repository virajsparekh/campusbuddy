import React, { useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Button, Avatar, TextField, IconButton, Stack, Divider, Tooltip, Paper } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ShareIcon from '@mui/icons-material/Share';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ViewListIcon from '@mui/icons-material/ViewList';
import AppsIcon from '@mui/icons-material/Apps';  
import Header from '../common/Header';  

const demoMyListings = [
  {
    id: 1,
    title: 'Jasper Hill 11 ft. x 13 ft. Brown Soft Top Gazebo with Solar LED Lighting',
    price: 600,
    oldPrice: 800,
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    status: 'Active',
    date: '6/5',
    clicks: 2,
  },
  {
    id: 2,
    title: 'VISSANI 1.5 cu MICROWAVES',
    price: 120,
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    status: 'Active',
    date: '5/25',
    clicks: 0,
  },
  {
    id: 3,
    title: '55" LG 4K OLED SMART TV - 1 YR WARRANTY. NO TAX',
    price: 1,
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    status: 'Active',
    date: '5/8',
    clicks: 88,
  },
];

const profile = {
  name: 'Viraj S Parekh',
  avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
  listings: 10,
};

export default function MyListings() {
  const [search, setSearch] = useState('');

  const filtered = demoMyListings.filter(l =>
    l.title.toLowerCase().includes(search.trim().toLowerCase())
  );

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
              <Card key={listing.id} sx={{ display: 'flex', alignItems: 'flex-start', p: 2, borderRadius: 4, boxShadow: 2, background: '#fff' }}>
                <CardMedia
                  component="img"
                  image={listing.img}
                  alt={listing.title}
                  sx={{ width: 120, height: 90, borderRadius: 2, objectFit: 'cover', mr: 2 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <InfoOutlinedIcon color="info" fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="#2563EB" fontWeight={600} sx={{ mr: 1 }}>
                      Tip: Renew your listing?
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#111827', mb: 0.5, lineHeight: 1.2 }}>
                    {listing.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#111827', fontSize: 18 }}>
                      CA${listing.price}
                    </Typography>
                    {listing.oldPrice && (
                      <Typography variant="body2" sx={{ color: '#6b7280', textDecoration: 'line-through', fontWeight: 500 }}>
                        CA${listing.oldPrice}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {listing.status} • Listed on {listing.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Listed on Marketplace • {listing.clicks} clicks on listing <InfoOutlinedIcon sx={{ fontSize: 16, verticalAlign: 'middle', ml: 0.5 }} color="disabled" />
                  </Typography>
                  <Stack direction="row" spacing={1}>
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
        </Box>
        <Box sx={{ width: 340, minWidth: 300, display: { xs: 'none', md: 'block' }, alignSelf: 'flex-start' }}>
          <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Avatar src={profile.avatar} sx={{ width: 48, height: 48 }} />
              <Box>
                <Typography fontWeight={700}>{profile.name}</Typography>
                <Typography variant="body2" color="text.secondary">{profile.listings} active listings</Typography>
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