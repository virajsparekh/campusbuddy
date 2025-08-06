import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import AdminLayout from './AdminLayout';
import { getImageUrl, isValidImageUrl, handleImageError } from '../../utils/imageUtils';

const categories = ['Workshop', 'Seminar', 'Party', 'Sports', 'Meetup', 'Other'];

export default function AdminEventManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    isPremiumOnly: false
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [page, searchTerm]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const searchParam = searchTerm ? `&search=${searchTerm}` : '';
      const response = await fetch(`/api/admin/events?page=${page}&limit=10${searchParam}`, {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
        setTotalPages(data.pagination.totalPages);
      } else {
        setError('Failed to fetch events');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (event) => {
    setSelectedEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split('T')[0],
      time: new Date(event.date).toTimeString().slice(0, 5),
      location: event.location,
      category: event.category || '',
      isPremiumOnly: event.isPremiumOnly
    });
    setOpenEditDialog(true);
  };

  const handleOpenDelete = (event) => {
    setSelectedEvent(event);
    setOpenDeleteDialog(true);
  };

  const handleOpenView = (event) => {
    setSelectedEvent(event);
    setOpenViewDialog(true);
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setSelectedEvent(null);
    setForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: '',
      isPremiumOnly: false
    });
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedEvent(null);
  };

  const handleCloseView = () => {
    setOpenViewDialog(false);
    setSelectedEvent(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/events/${selectedEvent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(form)
      });
      
      if (response.ok) {
        fetchEvents();
        handleCloseEdit();
        setSuccess('Event updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const data = await response.json();
        setError(data.msg || 'Failed to update event');
      }
    } catch (err) {
      setError('Error updating event');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/events/${selectedEvent._id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });
      
      if (response.ok) {
        fetchEvents();
        handleCloseDelete();
        setSuccess('Event deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const data = await response.json();
        setError(data.msg || 'Failed to delete event');
      }
    } catch (err) {
      setError('Error deleting event');
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ 
          p: 4, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh'
        }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ p: 4 }}>
        <Container maxWidth="xl">
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" fontWeight={700} color="#2563EB">
                Event Management
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => window.location.href = '/admin/post-event'}
              >
                Create Event
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {/* Search Bar */}
            <TextField
              fullWidth
              label="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="Search by title, description, or location..."
            />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Premium</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event._id}>
                                             <TableCell>
                         {isValidImageUrl(event.imageUrl) ? (
                           <img 
                             src={getImageUrl(event.imageUrl)}
                             alt={event.title}
                             style={{ 
                               width: '60px', 
                               height: '60px', 
                               objectFit: 'cover',
                               borderRadius: '8px'
                             }} 
                             onError={(e) => handleImageError(e, event.imageUrl)}
                           />
                         ) : (
                          <Box 
                            sx={{ 
                              width: '60px', 
                              height: '60px', 
                              bgcolor: '#f3f4f6',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              No Image
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {event.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {event.description.substring(0, 50)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(event.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(event.date).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>
                        <Chip 
                          label={event.category || 'N/A'} 
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={event.isPremiumOnly ? 'Premium' : 'Free'} 
                          size="small"
                          color={event.isPremiumOnly ? 'error' : 'success'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {event.createdBy?.name || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {event.createdBy?.email || ''}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenView(event)} color="primary">
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => handleOpenEdit(event)} color="warning">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleOpenDelete(event)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </Paper>
        </Container>

        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="md" fullWidth>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogContent>
            <Stack spacing={3} mt={1}>
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
              <FormControl fullWidth>
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
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDelete}>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete}>Cancel</Button>
            <Button onClick={handleDelete} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Event Dialog */}
        <Dialog open={openViewDialog} onClose={handleCloseView} maxWidth="md" fullWidth>
          <DialogTitle>Event Details</DialogTitle>
          <DialogContent>
            {selectedEvent && (
              <Grid container spacing={3}>
                                 {isValidImageUrl(selectedEvent.imageUrl) && (
                   <Grid item xs={12}>
                     <Card>
                       <CardMedia
                         component="img"
                         height="200"
                         image={getImageUrl(selectedEvent.imageUrl)}
                         alt={selectedEvent.title}
                         sx={{ objectFit: 'cover' }}
                         onError={(e) => handleImageError(e, selectedEvent.imageUrl)}
                       />
                     </Card>
                   </Grid>
                 )}
                <Grid item xs={12}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {selectedEvent.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {selectedEvent.description}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedEvent.date).toLocaleDateString()} at {new Date(selectedEvent.date).toLocaleTimeString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {selectedEvent.location}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">
                    {selectedEvent.category || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Premium Event
                  </Typography>
                  <Chip 
                    label={selectedEvent.isPremiumOnly ? 'Yes' : 'No'} 
                    color={selectedEvent.isPremiumOnly ? 'error' : 'success'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created By
                  </Typography>
                  <Typography variant="body1">
                    {selectedEvent.createdBy?.name} ({selectedEvent.createdBy?.email})
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created On
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedEvent.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseView}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
} 