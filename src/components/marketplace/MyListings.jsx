import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Button, Avatar, TextField, IconButton, Stack, Divider, Tooltip, Paper, CircularProgress, Alert, Pagination, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Snackbar } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Header from '../common/Header';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MyListings() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Edit functionality
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  
  // Share functionality
  const [shareSnackbar, setShareSnackbar] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  // Fetch user's listings
  const fetchMyListings = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });

      const response = await fetch(`http://localhost:5001/api/marketplace/my-listings?${params}`, {
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch your listings');
      }

      const data = await response.json();
      setListings(data.listings);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
    } catch (err) {
      console.error('Error fetching my listings:', err);
      setError('Failed to load your listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  // Edit listing
  const handleEdit = (listing) => {
    setEditingListing(listing);
    setEditForm({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category: listing.category,
      condition: listing.condition,
      contactInfo: listing.contactInfo,
      imageUrl: listing.img || '',
      location: listing.location || '',
      rent: listing.price || ''
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingListing) return;
    
    setEditLoading(true);
    try {
      const endpoint = editingListing.type === 'marketplace' 
        ? `/api/marketplace/listings/${editingListing._id}`
        : `/api/marketplace/accommodations/${editingListing._id}`;
      
      const payload = editingListing.type === 'marketplace' ? {
        title: editForm.title,
        description: editForm.description,
        price: editForm.price,
        category: editForm.category,
        condition: editForm.condition,
        contactInfo: editForm.contactInfo,
        imageUrl: editForm.imageUrl
      } : {
        location: editForm.location,
        rent: editForm.rent,
        details: editForm.description,
        contactInfo: editForm.contactInfo,
        imageUrl: editForm.imageUrl
      };


      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(payload)
      });

      

      if (!response.ok) {
        const errorData = await response.json();
        
        throw new Error(errorData.message || 'Failed to update listing');
      }

      const result = await response.json();
      

      // Update the listing in state
      setListings(prevListings => 
        prevListings.map(listing => 
          listing._id === editingListing._id 
            ? { ...listing, ...editForm }
            : listing
        )
      );

      setEditDialogOpen(false);
      setEditingListing(null);
      setEditForm({});
    } catch (err) {
      console.error('Error updating listing:', err);
      setError('Failed to update listing. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };


  // Share listing (direct button)
  const handleShareDirect = async (listing) => {
    const shareUrl = `${window.location.origin}/marketplace/listing/${listing._id}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: listing.description,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage('Link copied to clipboard!');
        setShareSnackbar(true);
      }
    } catch (err) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage('Link copied to clipboard!');
        setShareSnackbar(true);
      } catch (clipboardErr) {
        setShareMessage('Failed to copy link');
        setShareSnackbar(true);
      }
    }
  };

  // Delete listing (direct button)
  const handleDeleteDirect = async (listing) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {

      
      const response = await fetch(`http://localhost:5001/api/marketplace/listings/${listing._id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      

      if (response.ok) {
        const result = await response.json();
        
        setListings(prevListings => prevListings.filter(l => l._id !== listing._id));
        setTotalItems(prev => prev - 1);
      } else {
        const errorData = await response.json();
        
        throw new Error(errorData.message || 'Failed to delete listing');
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
      setError('Failed to delete listing. Please try again.');
    }
  };

  // Fetch listings when dependencies change
  useEffect(() => {
    if (token) {
      fetchMyListings();
    }
  }, [currentPage, token]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Filter listings based on search
  const filtered = listings.filter(l =>
    l.title.toLowerCase().includes(search.trim().toLowerCase()) ||
    l.description.toLowerCase().includes(search.trim().toLowerCase())
  );

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
    <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Header />
      <Box sx={{ width: '100%', maxWidth: 1200, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 8, p: 3 }}>
        <Box sx={{ flex: 1, maxWidth: 650, mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={5} mb={4} sx={{ width: '100%' }}>
            <Typography variant="h5" fontWeight={700} sx={{ color: '#111827' }}>Your listings ({totalItems})</Typography>
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

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Stack spacing={2} sx={{ width: '100%' }}>
                {filtered.map(listing => (
                  <Card key={listing._id} sx={{ display: 'flex', alignItems: 'flex-start', p: 2, borderRadius: 4, boxShadow: 2, background: '#fff' }}>
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
                          {listing.isPriority ? 'Priority Listing' : 'Active Listing'}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#111827', mb: 0.5, lineHeight: 1.2 }}>
                        {listing.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#111827', fontSize: 18 }}>
                          ${listing.price}{listing.priceUnit}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {listing.category} • {listing.condition}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Listed on {new Date(listing.createdAt).toLocaleDateString()} • {listing.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Contact: {listing.contactInfo}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(listing)}
                          sx={{ fontWeight: 600, borderRadius: 2, minWidth: 100 }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          startIcon={<ShareIcon />}
                          onClick={() => handleShareDirect(listing)}
                          sx={{ fontWeight: 600, borderRadius: 2, minWidth: 100 }}
                        >
                          Share
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteDirect(listing)}
                          sx={{ fontWeight: 600, borderRadius: 2, minWidth: 100 }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Box>
                  </Card>
                ))}
              </Stack>

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

              {filtered.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    {search ? 'No listings found matching your search.' : 'You haven\'t created any listings yet.'}
                  </Typography>
                  {!search && (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2, fontWeight: 600, borderRadius: 2 }}
                      href="/marketplace/post"
                    >
                      Create your first listing
                    </Button>
                  )}
                </Box>
              )}
            </>
          )}
        </Box>

        <Box sx={{ width: 340, minWidth: 300, display: { xs: 'none', md: 'block' }, alignSelf: 'flex-start' }}>
          <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography fontWeight={700}>{user?.name || 'User'}</Typography>
                <Typography variant="body2" color="text.secondary">{totalItems} active listings</Typography>
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
      


      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit {editingListing?.type === 'accommodation' ? 'Accommodation' : 'Listing'}</DialogTitle>
        <DialogContent>
          {editingListing?.type === 'accommodation' ? (
            // Accommodation fields
            <>
              <TextField
                label="Address"
                value={editForm.location || ''}
                onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Rent ($/mo)"
                value={editForm.rent || ''}
                onChange={(e) => setEditForm({...editForm, rent: e.target.value})}
                fullWidth
                margin="normal"
                type="number"
                required
              />
              <TextField
                label="Description"
                value={editForm.description || ''}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                fullWidth
                margin="normal"
                multiline
                rows={3}
                required
              />
            </>
          ) : (
            // Marketplace fields
            <>
              <TextField
                label="Title"
                value={editForm.title || ''}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Description"
                value={editForm.description || ''}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                fullWidth
                margin="normal"
                multiline
                rows={3}
                required
              />
              <TextField
                label="Price"
                value={editForm.price || ''}
                onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                fullWidth
                margin="normal"
                type="number"
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editForm.category || ''}
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                  label="Category"
                >
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Books">Books</MenuItem>
                  <MenuItem value="Furniture">Furniture</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={editForm.condition || ''}
                  onChange={(e) => setEditForm({...editForm, condition: e.target.value})}
                  label="Condition"
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Used">Used</MenuItem>
                  <MenuItem value="Like New">Like New</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          <TextField
            label="Contact Info"
            value={editForm.contactInfo || ''}
            onChange={(e) => setEditForm({...editForm, contactInfo: e.target.value})}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Image URL (optional)"
            value={editForm.imageUrl || ''}
            onChange={(e) => setEditForm({...editForm, imageUrl: e.target.value})}
            fullWidth
            margin="normal"
            placeholder="https://example.com/image.jpg"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained" 
            disabled={editLoading}
          >
            {editLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Snackbar */}
      <Snackbar
        open={shareSnackbar}
        autoHideDuration={3000}
        onClose={() => setShareSnackbar(false)}
        message={shareMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setShareSnackbar(false)}
          >
            <ContentCopyIcon />
          </IconButton>
        }
      />
    </Box>
  );
} 