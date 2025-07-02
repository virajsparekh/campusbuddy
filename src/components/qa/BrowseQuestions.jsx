import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, Stack, Button, TextField, InputAdornment, Divider, List, ListItem, ListItemIcon, ListItemText, Avatar, MenuItem, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../common/Header';

const demoQuestions = [
  {
    id: 1,
    title: 'How do I prepare for final exams effectively?',
    excerpt: 'I struggle with time management and want to know the best strategies for revision.',
    tags: ['study', 'exam'],
    date: '2024-06-01T10:00:00Z',
    status: 'Answered',
    views: 120,
    answers: 3,
    votes: 5,
    user: { name: 'Jane Doe', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  },
  {
    id: 2,
    title: 'Where can I find affordable housing near campus?',
    excerpt: 'Looking for recommendations or websites for student housing close to the university.',
    tags: ['housing', 'campus'],
    date: '2024-05-28T14:30:00Z',
    status: 'Open',
    views: 45,
    answers: 0,
    votes: 2,
    user: { name: 'Viraj S Parekh', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
  },
  {
    id: 3,
    title: 'What are the best clubs to join for networking?',
    excerpt: 'I want to expand my network and meet new people. Any club suggestions?',
    tags: ['clubs', 'networking'],
    date: '2024-05-20T09:15:00Z',
    status: 'Open',
    views: 60,
    answers: 1,
    votes: 0,
    user: { name: 'Alex Kim', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  },
  {
    id: 4,
    title: 'Tips for balancing part-time work and studies?',
    excerpt: 'I have a part-time job and find it hard to keep up with assignments. Any advice?',
    tags: ['work', 'study'],
    date: '2024-05-15T17:45:00Z',
    status: 'Answered',
    views: 80,
    answers: 2,
    votes: 3,
    user: { name: 'Priya Singh', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  },
  {
    id: 5,
    title: 'How to find good study spots on campus?',
    excerpt: 'Are there any quiet places or hidden gems for studying on campus?',
    tags: ['campus', 'study'],
    date: '2024-05-10T12:00:00Z',
    status: 'Open',
    views: 30,
    answers: 0,
    votes: 1,
    user: { name: 'Sam Lee', avatar: 'https://randomuser.me/api/portraits/men/41.jpg' },
  },
];

const leftNav = [
  { label: 'Questions', icon: <ListAltIcon />, link: '/qa/browse' },
  { label: 'My Questions', icon: <AssignmentIndIcon />, link: '/qa/myquestions' },
  { label: 'My Answers', icon: <QuestionAnswerIcon />, link: '/qa/myanswers' },
  { label: 'Ask Question', icon: <AddCircleOutlineIcon />, link: '/qa/ask' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'answers', label: 'Most Answers' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'unanswered', label: 'Unanswered' },
];

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

export default function BrowseQuestions() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  let filtered = demoQuestions.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    q.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );
  if (sort === 'answers') filtered = [...filtered].sort((a, b) => b.answers - a.answers);
  else if (sort === 'views') filtered = [...filtered].sort((a, b) => b.views - a.views);
  else if (sort === 'unanswered') filtered = filtered.filter(q => q.answers === 0);
  else filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100vw' }}>
      <Header />
    <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', py: 4, px: 2, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 4 }}>
      {/* Left Sidebar */}
      <Box sx={{ minWidth: 220, maxWidth: 240, mr: 2, display: { xs: 'none', md: 'block' } }}>
        <Paper elevation={1} sx={{ p: 2, borderRadius: 3 }}>
          <List>
            {leftNav.map(item => (
              <ListItem button key={item.label} component="a" href={item.link} sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
      {/* Main Content */}
      <Box sx={{ flex: 1, maxWidth: 900 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} gap={2}>
          <Typography variant="h4" fontWeight={700} color="#2563EB">
            Browse Questions
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              size="small"
              placeholder="Search questions"
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ background: '#fff', borderRadius: 2, minWidth: 180 }}
            />
            <Select
              size="small"
              value={sort}
              onChange={e => setSort(e.target.value)}
              sx={{ minWidth: 140, background: '#fff', borderRadius: 2 }}
            >
              {sortOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </Stack>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {filtered.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center', background: '#F1F5F9' }}>
            <Typography variant="h6" color="text.secondary">No questions found.</Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {filtered.map(q => (
              <Paper key={q.id} elevation={1} sx={{ p: 2, borderRadius: 3, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 2 }}>
                {/* Stats column */}
                <Box sx={{ minWidth: 80, textAlign: 'center', pt: 1 }}>
                  <Typography fontWeight={700} color="text.primary">{q.votes} <span style={{ fontWeight: 400, fontSize: 13 }}>votes</span></Typography>
                  <Typography fontWeight={700} color={q.answers > 0 ? 'success.main' : 'text.secondary'}>{q.answers} <span style={{ fontWeight: 400, fontSize: 13 }}>answers</span></Typography>
                  <Typography fontWeight={700} color="text.secondary">{q.views} <span style={{ fontWeight: 400, fontSize: 13 }}>views</span></Typography>
                </Box>
                {/* Main question info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                    {q.status === 'Answered' ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <HourglassEmptyIcon color="warning" fontSize="small" />
                    )}
                    <Button href="#" variant="text" sx={{ fontWeight: 700, fontSize: 18, color: '#111827', textAlign: 'left', p: 0, minWidth: 0, textTransform: 'none', '&:hover': { textDecoration: 'underline', background: 'none' } }}>{q.title}</Button>
                    <Chip
                      label={q.status}
                      color={q.status === 'Answered' ? 'success' : 'warning'}
                      size="small"
                      sx={{ ml: 1, fontWeight: 600 }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mb={1} sx={{ maxWidth: 700 }}>
                    {q.excerpt}
                  </Typography>
                  <Stack direction="row" spacing={1} mb={1}>
                    {q.tags.map(tag => <Chip key={tag} label={tag} color="primary" size="small" />)}
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                    <Avatar src={q.user.avatar} sx={{ width: 28, height: 28, mr: 1 }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>{q.user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">• {timeAgo(q.date)}</Typography>
                  </Stack>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
      {/* Right Sidebar */}
      <Box sx={{ minWidth: 260, maxWidth: 320, width: 320, ml: 2, alignSelf: 'flex-start', display: { xs: 'none', md: 'block' } }}>
        <Paper elevation={1} sx={{ p: 3, borderRadius: 3, mb: 2 }}>
          <Typography fontWeight={700} color="#2563EB" mb={1}>Tips for Asking</Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>• Search before you ask</Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>• Be clear and specific</Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>• Add relevant tags</Typography>
          <Typography variant="body2" color="text.secondary">• Be respectful and follow guidelines</Typography>
          <Button component={RouterLink} to="/support/help" size="small" sx={{ mt: 2, color: 'primary.main', textTransform: 'none', fontWeight: 500 }}>
            Need more help? Visit Help Center
          </Button>
        </Paper>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#F1F5F9' }}>
          <Typography fontWeight={700} color="#2563EB" mb={1}>CampusBuddy Q&A</Typography>
          <Typography variant="body2" color="text.secondary">Welcome to the community! Browse, ask, and help others with your knowledge.</Typography>
        </Paper>
      </Box>
    </Box>
    </Box>
    );
} 