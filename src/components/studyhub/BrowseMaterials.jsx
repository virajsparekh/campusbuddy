import React, { useState } from 'react';
import { Box, Card, Typography, Chip, Button, Grid, TextField, Avatar } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Header from '../common/Header';
import Footer from '../common/Footer';

const demoMaterials = [
  { file: 'road.jpeg', type: 'IMG', title: 'Big Data Lab 1 figure', subject: 'Big Data', uploader: 'Alice', tags: ['Big Data', 'Image'], url: '#' },
  { file: 'notes.pdf', type: 'PDF', title: 'Cloud Computing Assignment 1', subject: 'Cloud Computing', uploader: 'Bob', tags: ['Cloud', 'PDF'], url: '#' },
  { file: 'slides.pptx', type: 'PPT', title: 'Web Programming Lecture Week 1-3', subject: 'Web Programming', uploader: 'Charlie', tags: ['Web', 'Slides'], url: '#' },
  { file: 'outline.docx', type: 'DOC', title: 'Security in Web Test Paper', subject: 'Security in Web', uploader: 'Dana', tags: ['Web Security', 'Doc'], url: '#' },
];

const allTags = ['All', ...Array.from(new Set(demoMaterials.flatMap(m => m.tags)))];

export default function BrowseMaterials() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [search, setSearch] = useState('');

  let filtered = demoMaterials;
  if (selectedTag !== 'All') {
    filtered = filtered.filter(m => m.tags.includes(selectedTag));
  }
  if (search.trim()) {
    const s = search.trim().toLowerCase();
    filtered = filtered.filter(m =>
      m.title.toLowerCase().includes(s) ||
      m.subject.toLowerCase().includes(s) ||
      m.tags.some(tag => tag.toLowerCase().includes(s))
    );
  }

  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--cb-bg, #F1F5F9)', zIndex: 1 }}>
      <Header />
      <Box sx={{ maxWidth: 1100, mx: 'auto', width: '100%' }}>
        <Typography variant="h5" fontWeight={700} color="#2563EB" mb={2}>
          Browse Study Materials
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            variant="outlined"
            placeholder="Search by title, subject, or tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ flex: 1, background: '#fff', borderRadius: 2 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          {allTags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              color={selectedTag === tag ? 'primary' : 'default'}
              onClick={() => setSelectedTag(tag)}
              sx={{ fontWeight: 600, cursor: 'pointer' }}
            />
          ))}
        </Box>
        <Grid container spacing={3} justifyContent="center">
          {filtered.map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ p: 3, borderRadius: 4, boxShadow: 4, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', background: '#fff', minWidth: 320, maxWidth: 400, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Avatar sx={{ bgcolor: '#F59E0B', width: 32, height: 32, fontWeight: 700, fontSize: 16 }}>
                    {item.type}
                  </Avatar>
                  <Typography fontWeight={700} color="#2563EB">{item.title}</Typography>
                </Box>
                <Typography variant="body2"><strong>Subject:</strong> {item.subject}</Typography>
                <Typography variant="body2"><strong>Uploader:</strong> {item.uploader}</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  {item.tags.map(tag => (
                    <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#DBEAFE', color: '#2563EB', fontWeight: 600 }} />
                  ))}
                </Box>
                <Button variant="contained" color="primary" href={item.url} sx={{ fontWeight: 600, borderRadius: 2, px: 3, mt: 1 }}>
                  View
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
} 