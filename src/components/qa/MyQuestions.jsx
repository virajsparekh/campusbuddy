import React, { useState } from 'react';
import {
  Box, Typography, Paper, Chip, Stack, Button, IconButton, Tooltip, TextField, InputAdornment, Fab, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../common/Header';
    
const demoQuestions = [
  {
    id: 1,
    title: 'How do I prepare for final exams effectively?',
    details: 'I struggle with time management and want to know the best strategies for revision.',
    tags: ['study', 'exam'],
    date: '2024-06-01',
    status: 'Answered',
    views: 120,
    answers: 3,
  },
  {
    id: 2,
    title: 'Where can I find affordable housing near campus?',
    details: 'Looking for recommendations or websites for student housing close to the university.',
    tags: ['housing', 'campus'],
    date: '2024-05-28',
    status: 'Open',
    views: 45,
    answers: 0,
  },
];

const profile = {
  name: 'Viraj S Parekh',
  avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
  answered: 1,
  open: 1,
};

export default function MyQuestions() {
  const [search, setSearch] = useState('');
  const filtered = demoQuestions.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    q.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100vw' }}>
      <Header />
    <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', py: 6, px: 2, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 6, width: '100vw' }}>
      {/* Main Content */}
      <Box sx={{ width: '100%', maxWidth: 1000 }}>
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
              <Paper key={q.id} elevation={2} sx={{ p: 3, borderRadius: 3, display: 'flex', flexDirection: 'row', gap: 2, position: 'relative', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    {q.status === 'Answered' ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <HourglassEmptyIcon color="warning" fontSize="small" />
                    )}
                    <Typography variant="h6" fontWeight={700} color="#111827">{q.title}</Typography>
                    <Chip
                      label={q.status}
                      color={q.status === 'Answered' ? 'success' : 'warning'}
                      size="small"
                      sx={{ ml: 1, fontWeight: 600 }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mb={1} sx={{ maxWidth: 700 }}>
                    {q.details}
                  </Typography>
                  <Stack direction="row" spacing={1} mb={1}>
                    {q.tags.map(tag => <Chip key={tag} label={tag} color="primary" size="small" />)}
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(q.date).toLocaleDateString()} • {q.views} views • {q.answers} answers
                    </Typography>
                    <Button variant="outlined" color="primary" size="small" sx={{ ml: 'auto' }}>View</Button>
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
          href="/qa/ask"
          sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}
        >
          <AddIcon />
        </Fab>
      </Box>
      {/* Sidebar */}
      <Box sx={{ minWidth: 260, maxWidth: 320, width: 320, ml: 2, alignSelf: 'flex-start' }}>
        <Paper elevation={1} sx={{ p: 3, borderRadius: 3, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar src={profile.avatar} sx={{ width: 64, height: 64, mb: 1 }} />
          <Typography fontWeight={700} mb={0.5}>{profile.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Total Questions: <b>{demoQuestions.length}</b>
          </Typography>
        </Paper>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#F1F5F9', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Typography fontWeight={600} color="success.main">Questions Answered: {profile.answered}</Typography>
          <Typography fontWeight={600} color="warning.main">Questions Open: {profile.open}</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2, borderRadius: 2 }} href="/profile">View Profile</Button>
        </Paper>
      </Box>
    </Box>
    </Box>
  );
} 