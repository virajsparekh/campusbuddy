import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/api';
import {
  Box, Typography, Paper, Chip, Stack, Button, IconButton, Tooltip, TextField, InputAdornment, Fab, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MyQuestions() {
  const { token, user } = useAuth();
  const [questions, setQuestions] = useState([]);
  

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Fetch user's questions
  const fetchMyQuestions = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(getApiUrl('/api/qa/my-questions'), {
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load your questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyQuestions();
    }
  }, [token]);

  // Filter questions based on search
  const filtered = questions.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    q.description.toLowerCase().includes(search.toLowerCase()) ||
    q.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  // Calculate profile stats
  const profile = {
    name: user?.name || 'User',
    avatar: user?.name ? user.name.charAt(0).toUpperCase() : 'U',
    answered: questions.filter(q => q.status === 'Answered').length,
    open: questions.filter(q => q.status === 'Open').length,
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" fontWeight={700} color="#2563EB">
            My Questions
          </Typography>
          <TextField
            size="small"
            placeholder="Search your questions"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ background: '#fff', borderRadius: 2, minWidth: 220 }}
          />
        </Stack>
        {filtered.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center', background: '#F1F5F9' }}>
            <Typography variant="h6" color="text.secondary">No questions found.</Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {filtered.map(q => (
              <Paper key={q._id} elevation={2} sx={{ p: 3, borderRadius: 3, display: 'flex', flexDirection: 'row', gap: 2, position: 'relative', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    {q.status === 'Answered' ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <HourglassEmptyIcon color="warning" fontSize="small" />
                    )}
                    <Typography variant="h6" fontWeight={700} color="#111827">{q.title}</Typography>
                    <Chip
                      label={q.status === 'Answered' ? 'Answered' : 'Open'}
                      color={q.status === 'Answered' ? 'success' : 'warning'}
                      size="small"
                      sx={{ ml: 1, fontWeight: 600 }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mb={1} sx={{ maxWidth: 700 }}>
                    {q.description}
                  </Typography>
                  <Stack direction="row" spacing={1} mb={1}>
                    {q.tags?.map(tag => <Chip key={tag} label={tag} color="primary" size="small" />)}
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(q.createdAt).toLocaleDateString()} • {q.views || 0} views • {q.answers || 0} answers
                    </Typography>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="small" 
                      component={RouterLink}
                      to={`/qa/question/${q._id}`}
                      sx={{ ml: 'auto' }}
                    >
                      View
                    </Button>
                  </Stack>
                </Box>
                {/* Right actions box */}
                <Box sx={{ minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start', mt: 1 }}>
                  <Button startIcon={<EditIcon />} size="small" color="primary" sx={{ mb: 1, textTransform: 'none' }}>Edit</Button>
                  <Button startIcon={<DeleteIcon />} size="small" color="error" sx={{ textTransform: 'none' }}>Delete</Button>
                  {q.status === 'Answered' ? (
                    <Chip label="Answered" color="success" size="small" icon={<CheckCircleIcon />} sx={{ mt: 1 }} />
                  ) : (
                    <Chip label="Open" color="warning" size="small" icon={<HourglassEmptyIcon />} sx={{ mt: 1 }} />
                  )}
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
        <Fab
          color="primary"
          aria-label="ask"
          component={RouterLink}
          to="/qa/ask"
          sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}
        >
          <AddIcon />
        </Fab>
    </Box>
  );
} 