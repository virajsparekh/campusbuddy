import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  MenuItem,
  Stack,
  InputLabel,
  Select,
  FormControl,
  Alert,
  CircularProgress
} from '@mui/material';
import AdminLayout from './AdminLayout'; 

const categories = ['Workshop', 'Seminar', 'Party', 'Sports', 'Meetup', 'Other'];

export default function AdminPostEvent() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    isPremiumOnly: false
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('date', form.date);
      formData.append('time', form.time);
      formData.append('location', form.location);
      formData.append('category', form.category);
      formData.append('isPremiumOnly', form.isPremiumOnly);
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'x-auth-token': token
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData
      });

      if (response.ok) {
        setSubmitted(true);
        setForm({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          category: '',
          isPremiumOnly: false
        });
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        const data = await response.json();
        setError(data.msg || 'Failed to create event');
      }
    } catch (err) {
      setError('Error creating event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 4 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
            <Typography variant="h4" fontWeight={700} color="#2563EB" mb={3}>
              Post New Event
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {submitted ? (
              <Typography color="success.main" fontWeight={600} textAlign="center" py={4}>
                Event posted successfully!
              </Typography>
            ) : (
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Event Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    fullWidth
                    multiline
                    rows={3}
                  />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label="Date"
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                    <TextField
                      label="Time"
                      name="time"
                      type="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Stack>
                  <TextField
                    label="Location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                  <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={form.category}
                      label="Category"
                      onChange={handleChange}
                    >
                      {categories.map(cat => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Premium Only</InputLabel>
                    <Select
                      name="isPremiumOnly"
                      value={form.isPremiumOnly}
                      label="Premium Only"
                      onChange={handleChange}
                    >
                      <MenuItem value={false}>No</MenuItem>
                      <MenuItem value={true}>Yes</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {/* Image Upload Section */}
                  <Box>
                    <Button variant="outlined" component="label" fullWidth>
                      Upload Event Image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                      />
                    </Button>
                    {imagePreview && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '200px', 
                            borderRadius: '8px' 
                          }} 
                        />
                      </Box>
                    )}
                  </Box>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ borderRadius: 2 }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Post Event'}
                  </Button>
                </Stack>
              </form>
            )}
          </Paper>
        </Container>
      </Box>
    </AdminLayout>
  );
}
