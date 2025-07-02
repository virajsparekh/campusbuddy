import React from 'react';
import { Box, Typography, Paper, Chip, Stack, Button, Avatar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import Header from '../common/Header';
const demoAnswers = [
  {
    id: 1,
    question: 'How do I prepare for final exams effectively?',
    answer: 'I recommend making a revision timetable and practicing past papers. Focus on your weak areas and take regular breaks.',
    tags: ['study', 'exam'],
    date: '2024-06-02',
    status: 'Accepted',
  },
  {
    id: 2,
    question: 'Where can I find affordable housing near campus?',
    answer: 'Check out the university housing portal and local Facebook groups. Sometimes bulletin boards on campus have listings too.',
    tags: ['housing', 'campus'],
    date: '2024-05-29',
    status: 'Pending',
  },
];

const profile = {
  name: 'Viraj S Parekh',
  avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
  totalAnswers: demoAnswers.length,
  accepted: 1,
  pending: 1,
};

export default function MyAnswers() {
  return (
    <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100vw' }}>
      <Header />
    <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', py: 6, px: 2, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 6, width: '100vw' }}>
      {/* Main Content */}
      <Box sx={{ width: '100%', maxWidth: 1000 }}>
        <Typography variant="h4" fontWeight={700} color="#2563EB" mb={3}>
          My Answers
        </Typography>
        {demoAnswers.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center', background: '#F1F5F9' }}>
            <Typography variant="h6" color="text.secondary">You haven't answered any questions yet.</Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {demoAnswers.map(a => (
              <Paper key={a.id} elevation={2} sx={{ p: 3, borderRadius: 3, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    {a.status === 'Accepted' ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <HourglassEmptyIcon color="warning" fontSize="small" />
                    )}
                    <Typography variant="h6" fontWeight={700} color="#111827">{a.question}</Typography>
                    <Chip
                      label={a.status}
                      color={a.status === 'Accepted' ? 'success' : 'warning'}
                      size="small"
                      sx={{ ml: 1, fontWeight: 600 }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mb={1} sx={{ maxWidth: 700 }}>
                    {a.answer}
                  </Typography>
                  <Stack direction="row" spacing={1} mb={1}>
                    {a.tags.map(tag => <Chip key={tag} label={tag} color="primary" size="small" />)}
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Answered on {new Date(a.date).toLocaleDateString()}
                  </Typography>
                </Box>
                {/* Right status box */}
                <Box sx={{ minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start', mt: 1 }}>
                  {a.status === 'Accepted' ? (
                    <Chip label="Accepted" color="success" size="small" icon={<CheckCircleIcon />} sx={{ mt: 1 }} />
                  ) : (
                    <Chip label="Pending" color="warning" size="small" icon={<HourglassEmptyIcon />} sx={{ mt: 1 }} />
                  )}
                  <Button variant="outlined" color="primary" size="small" sx={{ mt: 1 }}>View Question</Button>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
      {/* Sidebar */}
      <Box sx={{ minWidth: 260, maxWidth: 320, width: 320, ml: 2, alignSelf: 'flex-start' }}>
        <Paper elevation={1} sx={{ p: 3, borderRadius: 3, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar src={profile.avatar} sx={{ width: 64, height: 64, mb: 1 }} />
          <Typography fontWeight={700} mb={0.5}>{profile.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Total Answers: <b>{profile.totalAnswers}</b>
          </Typography>
        </Paper>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#F1F5F9', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Typography fontWeight={600} color="success.main">Accepted: {profile.accepted}</Typography>
          <Typography fontWeight={600} color="warning.main">Pending: {profile.pending}</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2, borderRadius: 2 }} href="/profile">View Profile</Button>
        </Paper>
      </Box>
    </Box>
    </Box>
  );
} 