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
  FormControl
} from '@mui/material';
import AdminSidebar from './AdminSidebar'; // make sure path is correct

const categories = ['Workshop', 'Seminar', 'Party', 'Sports', 'Meetup', 'Other'];

export default function AdminPostEvent() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image: null,
    category: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f3f4f6', width: '100vw' }}>
      <AdminSidebar />
      <Box sx={{ flex: 1, p: 4 }}>
        <Container maxWidth="md" sx={{width: '500'}}>
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
            <Typography variant="h4" fontWeight={700} color="#2563EB" mb={3}>
              Post New Event
            </Typography>
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
                  <Button variant="outlined" component="label">
                    Upload Image
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      hidden
                      onChange={handleChange}
                    />
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ borderRadius: 2 }}
                  >
                    Post Event
                  </Button>
                </Stack>
              </form>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
