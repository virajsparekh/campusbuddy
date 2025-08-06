import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/api';
import { Box, Typography, Paper, Chip, Stack, Button, TextField, InputAdornment, Divider, List, ListItem, ListItemIcon, ListItemText, Avatar, MenuItem, Select, CircularProgress, Alert, Pagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'most_answers', label: 'Most Answers' },
  { value: 'most_views', label: 'Most Viewed' },
  { value: 'most_votes', label: 'Most Voted' },
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
  const { token } = useAuth();
  const [questions, setQuestions] = useState([]);
  

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Fetch questions from API
  const fetchQuestions = async (page = 1) => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: page,
        limit: itemsPerPage,
        sort: sortBy
      });

      if (search) {
        params.append('search', search);
      }

      if (selectedTags.length > 0) {
        params.append('tags', selectedTags.join(','));
      }

      if (status) {
        params.append('status', status);
      }

      const response = await fetch(getApiUrl(`/api/qa/questions?${params}`), {
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
      setCurrentPage(data.pagination.currentPage);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions on component mount and when filters change
  useEffect(() => {
    if (token) {
      fetchQuestions(currentPage);
    }
  }, [token, currentPage, sortBy, status]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (token) {
        setCurrentPage(1);
        fetchQuestions(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, selectedTags]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  // Get unique tags from questions
  const allTags = Array.from(new Set(questions.flatMap(q => q.tags || [])));

  if (loading && questions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={700} color="#111827">
              Browse Questions
            </Typography>
            <Button
              component={RouterLink}
              to="/qa/ask"
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Ask Question
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Filters */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Stack spacing={3}>
              {/* Search */}
              <TextField
                fullWidth
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: 400 }}
              />

              {/* Filters Row */}
              <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  size="small"
                  sx={{ minWidth: 150 }}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>

                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="small"
                  displayEmpty
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Answered">Answered</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </Select>

                <Select
                  multiple
                  value={selectedTags}
                  onChange={(e) => setSelectedTags(e.target.value)}
                  size="small"
                  displayEmpty
                  renderValue={(selected) => selected.length === 0 ? 'All Tags' : `${selected.length} selected`}
                  sx={{ minWidth: 150 }}
                >
                  {allTags.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>
          </Paper>

          {/* Questions Count */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {questions.length} of {totalItems} questions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Page {currentPage} of {totalPages}
            </Typography>
          </Box>

          {/* Questions List */}
          {questions.length === 0 ? (
            <Paper elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h6" color="text.secondary" mb={2}>
                No questions found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria or ask a new question.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {questions.map((question) => (
                <Paper key={question._id} elevation={1} sx={{ p: 3, borderRadius: 3, '&:hover': { boxShadow: 3 } }}>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    {/* Stats */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
                      <Typography variant="h6" fontWeight={700} color={question.votes >= 0 ? 'success.main' : 'error.main'}>
                        {question.votes}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        votes
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ mt: 1 }}>
                        {question.answers}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        answers
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {question.views} views
                      </Typography>
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {question.status === 'Answered' ? (
                          <CheckCircleIcon color="success" fontSize="small" />
                        ) : (
                          <HourglassEmptyIcon color="warning" fontSize="small" />
                        )}
                        <Chip
                          label={question.status}
                          size="small"
                          color={question.status === 'Answered' ? 'success' : 'warning'}
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      <Typography
                        variant="h6"
                        component={RouterLink}
                        to={`/qa/question/${question._id}`}
                        sx={{
                          color: 'text.primary',
                          textDecoration: 'none',
                          fontWeight: 600,
                          '&:hover': { color: 'primary.main' },
                          display: 'block',
                          mb: 1,
                          cursor: 'pointer'
                        }}
                      >
                        {question.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {question.description}
                      </Typography>

                      {/* Tags */}
                      <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                        {question.tags?.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Stack>

                      {/* Meta */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar src={`https://api.dicebear.com/7.x/initials/svg?seed=${question.askedBy?.name || 'User'}`} sx={{ width: 24, height: 24 }} />
                          <Typography variant="caption" color="text.secondary">
                            {question.askedBy?.name || 'Unknown'} • {timeAgo(question.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Box>
    );
} 