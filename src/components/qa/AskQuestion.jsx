import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Chip, Stack, Avatar, Divider, InputAdornment, IconButton, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../common/Header';

const tagSuggestions = ['study', 'exam', 'housing', 'marketplace', 'events', 'clubs', 'career', 'food', 'campus', 'tech'];

export default function AskQuestion() {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  const handleAddTag = (tag) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !details.trim() || tags.length === 0) {
      setError('Please fill in all required fields and add at least one tag.');
      return;
    }
    setError('');
    // Submit logic here
    alert('Question submitted!');
  };

  return (
    <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100vw' }}>
      <Header />
      <Box sx={{ width: '100%', maxWidth: 1400, display: 'flex', gap: 6, mx: 'auto', minHeight: '80vh' }}>
        {/* Main Form */}
        <Paper elevation={2} sx={{ flex: 1.5, maxWidth: 950, width: '100%', p: { xs: 2, md: 4 }, borderRadius: 4, minWidth: 0, minHeight: '80vh', maxHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflowY: 'auto' }}>
          <Typography variant="h4" fontWeight={700} mb={2} color="#2563EB">
            Ask the Community
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Get help from fellow students and experts. Provide as much detail as possible for the best answers.
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Question Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                fullWidth
                inputProps={{ maxLength: 120 }}
                placeholder="Be specific and imagine you're asking another student."
              />
              <TextField
                label="Details"
                value={details}
                onChange={e => setDetails(e.target.value)}
                required
                fullWidth
                multiline
                minRows={5}
                placeholder="Describe your problem, what you've tried, and what you expect."
              />
              <Box>
                <Typography fontWeight={600} mb={1}>Tags <Typography component="span" color="text.secondary" fontWeight={400}>(up to 5)</Typography></Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                  {tags.map(tag => (
                    <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} color="primary" />
                  ))}
                </Stack>
                <TextField
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if ((e.key === 'Enter' || e.key === ',' || e.key === ' ') && tagInput.trim()) {
                      e.preventDefault();
                      handleAddTag(tagInput.trim().toLowerCase());
                    }
                  }}
                  placeholder="Add a tag and press Enter"
                  size="small"
                  sx={{ width: 260 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleAddTag(tagInput.trim().toLowerCase())} disabled={!tagInput.trim() || tags.length >= 5}>
                          <HelpOutlineIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Stack direction="row" spacing={1} mt={1}>
                  {tagSuggestions.filter(s => !tags.includes(s) && s.includes(tagInput.toLowerCase())).slice(0, 5).map(s => (
                    <Chip key={s} label={s} variant="outlined" onClick={() => handleAddTag(s)} clickable />
                  ))}
                </Stack>
              </Box>
              <Box>
                <Typography fontWeight={600} mb={1}>Optional Image</Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AddPhotoAlternateIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                </Button>
                {imagePreview && (
                  <Box sx={{ mt: 2 }}>
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: 180, borderRadius: 8 }} />
                  </Box>
                )}
              </Box>
              {error && <Typography color="error" fontWeight={600}>{error}</Typography>}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ fontWeight: 700, borderRadius: 2, fontSize: 18 }}
                disabled={!title.trim() || !details.trim() || tags.length === 0}
              >
                Post Your Question
              </Button>
            </Stack>
          </form>
        </Paper>
        {/* Sidebar with Tips */}
        <Box sx={{ flex: 1, minWidth: 260, maxWidth: 340, ml: 2, mt: 0 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, background: '#F1F5F9', mb: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={1} color="#2563EB">
              Tips for a Great Question
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1}>
              <Typography variant="body2">• Write a clear, descriptive title.</Typography>
              <Typography variant="body2">• Explain your problem in detail.</Typography>
              <Typography variant="body2">• Share what you've tried so far.</Typography>
              <Typography variant="body2">• Add relevant tags to help others find your question.</Typography>
              <Typography variant="body2">• Be respectful and follow our community guidelines.</Typography>
            </Stack>
            <Button component={RouterLink} to="/support/help" size="small" sx={{ mt: 2, color: 'primary.main', textTransform: 'none', fontWeight: 500 }}>
              Need more help? Visit Help Center
            </Button>
          </Paper>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, background: '#F1F5F9' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <InfoOutlinedIcon color="info" />
              <Typography fontWeight={600}>Need help?</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Check out our <a href="/community-guidelines" style={{ color: '#2563EB', textDecoration: 'underline' }}>community guidelines</a> for tips on asking and answering questions.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
} 