import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, MenuItem, Select, InputLabel, Paper, Avatar, Switch } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Header from '../common/Header';

const categories = ['Electronics', 'Books', 'Furniture', 'Other'];
const amenities = ['WiFi', 'Furnished', 'Meals Included', 'Laundry', 'Parking'];
const isPremiumUser = true; // Simulate premium user

export default function PostListing() {
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
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Demo submit: ' + JSON.stringify({ type, ...form }, null, 2));
  };

  return (
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
              <TextField label="Description" value={form.description} onChange={handleChange('description')} fullWidth multiline minRows={3} variant="outlined" sx={{ mb: 2 }} />
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
                  <TextField label="Location" value={form.location} onChange={handleChange('location')} fullWidth variant="outlined" sx={{ mb: 2 }} />
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
              <Button type="submit" variant="contained" fullWidth sx={{ fontWeight: 700, fontSize: 16, py: 1.2, borderRadius: 2, background: '#2563EB', boxShadow: '0 2px 8px 0 rgba(37,99,235,0.10)', '&:hover': { background: '#1e40af' } }}>
                Post Listing
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
  );
} 