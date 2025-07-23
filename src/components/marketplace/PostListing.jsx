import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, MenuItem, Select, InputLabel, Paper, Avatar, Switch, Snackbar, Alert, CircularProgress } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Header from '../common/Header';
import { marketplaceAPI } from '../../services/marketplaceAPI';
import { useNavigate } from 'react-router-dom';

const categories = ['Electronics', 'Books', 'Furniture', 'Other'];
const amenities = ['WiFi', 'Furnished', 'Meals Included', 'Laundry', 'Parking'];
const isPremiumUser = true; // Simulate premium user

export default function PostListing() {
  const navigate = useNavigate();
  const [type, setType] = useState('item');
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
    location: '',
    rent: '',
    amenities: [],
    address: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [priority, setPriority] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleAmenitiesChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, amenities: typeof value === 'string' ? value.split(',') : value });
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setForm({ ...form, title: '', description: '', price: '', category: '', image: '', location: '', rent: '', amenities: [], address: '' });
    setImagePreview('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress the image
        compressImage(reader.result, (compressedImage) => {
          setImagePreview(compressedImage);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to compress image
  const compressImage = (dataUrl, callback) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set max dimensions
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 600;
      
      let { width, height } = img;
      
      // Calculate new dimensions
      if (width > height) {
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height;
          height = MAX_HEIGHT;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
      callback(compressedDataUrl);
    };
    img.src = dataUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!form.title || !form.description) {
        setSnackbar({
          open: true,
          message: 'Title and description are required.',
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      if (type === 'item' && (!form.price || !form.category || !form.location)) {
        setSnackbar({
          open: true,
          message: 'Price, category, and location are required for items.',
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      if (type === 'accommodation' && (!form.rent || !form.address)) {
        setSnackbar({
          open: true,
          message: 'Rent and address are required for accommodations.',
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      // Prepare the listing data
      const listingData = {
        title: form.title,
        description: form.description,
        type: type,
        image: imagePreview,
        priority: isPremiumUser ? priority : false
      };

      // Add type-specific fields
      if (type === 'item') {
        listingData.price = parseFloat(form.price);
        listingData.category = form.category;
        listingData.location = form.location;
      } else if (type === 'accommodation') {
        listingData.rent = parseFloat(form.rent);
        listingData.address = form.address;
        listingData.amenities = form.amenities;
      }

      // Create the listing via API
      await marketplaceAPI.createListing(listingData);

      // Show success message
      setSnackbar({
        open: true,
        message: 'Listing posted successfully!',
        severity: 'success'
      });

      // Reset form
      setForm({
        title: '',
        description: '',
        price: '',
        category: '',
        image: '',
        location: '',
        rent: '',
        amenities: [],
        address: '',
      });
      setImagePreview('');
      setPriority(false);

      // Navigate to browse listings after a short delay
      setTimeout(() => {
        navigate('/marketplace');
      }, 2000);

    } catch (error) {
      console.error('Error creating listing:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to post listing. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw' }}>
        <Header />
        <Box sx={{ height: '100vh', overflow: 'hidden', py: { xs: 2, md: 6 }, px: 3, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 4, background: 'var(--cb-bg, #F1F5F9)' }}>
          <Box sx={{ flexBasis: { xs: '100%', md: '32%' }, minWidth: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
            <Paper elevation={0} sx={{ borderRadius: 3, p: { xs: 2, sm: 4 }, height: '90vh', minHeight: 400, width: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 12px 0 rgba(37,99,235,0.08)', border: '1px solid #e5e7eb', position: 'relative', overflowY: 'auto', overflowX: 'hidden' }}>
              <Box sx={{ position: 'sticky', bottom: 0, background: 'inherit', zIndex: 2, pt: 2 }}>
              <Typography variant="h5" fontWeight={700} color="#2563EB" mb={2}>
                Post a Listing
              </Typography>
              </Box>
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ color: '#2563EB', fontWeight: 600, fontSize: 16 }}>Listing Type</FormLabel>
                <RadioGroup row value={type} onChange={handleTypeChange} sx={{ gap: 3, mt: 1 }}>
                  <FormControlLabel value="item" control={<Radio color="primary" />} label="Sell Item" />
                  <FormControlLabel value="accommodation" control={<Radio color="primary" />} label="Rent Place" />
                </RadioGroup>
              </FormControl>
              {isPremiumUser && (
                <FormControlLabel
                  control={<Switch checked={priority} onChange={e => setPriority(e.target.checked)} color="primary" />}
                  label="Priority Listing (Always show on top)"
                  sx={{ mb: 2 }}
                />
              )}
              <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ flex: '1 1 auto', minHeight: 0, pb: 2 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<AddPhotoAlternateIcon />}
                    sx={{ mb: 2, borderRadius: 2 }}
                    fullWidth
                  >
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                    <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                  </Button>
                  {imagePreview && (
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8 }} />
                    </Box>
                  )}
                  <TextField label="Title" value={form.title} onChange={handleChange('title')} fullWidth required variant="outlined" sx={{ mb: 2 }} />
                  <TextField label="Description" value={form.description} onChange={handleChange('description')} fullWidth required multiline minRows={3} variant="outlined" sx={{ mb: 2 }} />
                  {type === 'item' ? (
                    <>
                      <TextField label="Price ($)" value={form.price} onChange={handleChange('price')} fullWidth required type="number" variant="outlined" sx={{ mb: 2 }} />
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select value={form.category} label="Category" onChange={handleChange('category')} required>
                          <MenuItem value=""><em>Select Category</em></MenuItem>
                          {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                        </Select>
                      </FormControl>
                      <TextField label="Location" value={form.location} onChange={handleChange('location')} fullWidth required variant="outlined" sx={{ mb: 2 }} />
                    </>
                  ) : (
                    <>
                      <TextField label="Rent ($/mo)" value={form.rent} onChange={handleChange('rent')} fullWidth required type="number" variant="outlined" sx={{ mb: 2 }} />
                      <TextField label="Address" value={form.address} onChange={handleChange('address')} fullWidth required variant="outlined" sx={{ mb: 2 }} />
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Amenities</InputLabel>
                        <Select
                          multiple
                          value={form.amenities}
                          onChange={handleAmenitiesChange}
                          label="Amenities"
                          renderValue={(selected) => selected.join(', ')}
                        >
                          {amenities.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </>
                  )}
                </Box>
                <Box>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    disabled={loading}
                    sx={{ 
                      fontWeight: 700, 
                      fontSize: 16, 
                      py: 1.2, 
                      borderRadius: 2, 
                      background: '#2563EB', 
                      boxShadow: '0 2px 8px 0 rgba(37,99,235,0.10)', 
                      '&:hover': { background: '#1e40af' },
                      '&:disabled': { background: '#9ca3af' }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Post Listing'
                    )}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Box>
          {/* Preview Card (strictly sticky, never scrolls) */}
          <Box sx={{ flexBasis: { xs: '100%', md: '68%' }, minWidth: 0, position: { md: 'sticky' }, top: { md: 32 }, height: { md: '80vh' }, minHeight: 400, zIndex: 1, alignSelf: 'flex-start' }}>
            <Paper elevation={0} sx={{ borderRadius: 3, height: '100%', width: '100%', display: 'flex', flexDirection: 'row', boxShadow: '0 2px 12px 0 rgba(37,99,235,0.08)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              {/* Left: Image Area */}
              <Box sx={{ flex: 6, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 0 }} />
                ) : (
                  <Box sx={{ width: '90%', height: '60%', background: '#e5e7eb', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Image Preview</Typography>
                  </Box>
                )}
              </Box>
              {/* Right: Details Area */}
              <Box sx={{ flex: 4, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minWidth: 0 }}>
                <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
                  {form.title || 'Title'}
                </Typography>
                <Typography color="text.secondary" fontWeight={500} gutterBottom>
                  {type === 'item' ? (form.price ? `$${form.price}` : 'Price') : (form.rent ? `$${form.rent}/mo` : 'Rent')}
                </Typography>
                <Typography color="text.secondary" fontSize={15} gutterBottom>
                  {form.description || 'Description will appear here.'}
                </Typography>
                {form.category && (
                  <Typography color="primary" fontWeight={600} fontSize={14} gutterBottom>
                    Category: {form.category}
                  </Typography>
                )}
                {form.location && (
                  <Typography color="primary" fontWeight={600} fontSize={14} gutterBottom>
                    Location: {form.location}
                  </Typography>
                )}
                {isPremiumUser && priority && (
                  <Typography color="warning.main" fontWeight={700} fontSize={15} gutterBottom>
                    Priority Listing
                  </Typography>
                )}
                <Box sx={{ mt: 2, borderTop: '1px solid #e5e7eb', pt: 2 }}>
                  <Typography fontWeight={600} color="text.primary" mb={1}>
                    Seller information
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src="https://randomuser.me/api/portraits/men/75.jpg" sx={{ width: 40, height: 40 }} />
                    <Box>
                      <Typography fontWeight={600} color="text.primary">Viraj S Parekh</Typography>
                      <Typography fontSize={13} color="text.secondary">Listing to Marketplace • Public</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
} 