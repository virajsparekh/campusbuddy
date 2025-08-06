import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/api';
import { Box, Typography, Paper, Chip, Stack, Button, Avatar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function MyAnswers() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  

  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's answers
  const fetchMyAnswers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(getApiUrl('/api/qa/my-answers'), {
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch answers');
      }

      const data = await response.json();
      setAnswers(data.answers);
    } catch (err) {
      console.error('Error fetching answers:', err);
      setError('Failed to load your answers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyAnswers();
    }
  }, [token]);

  // Calculate profile stats
  const profile = {
    name: user?.name || 'User',
    avatar: user?.name ? user.name.charAt(0).toUpperCase() : 'U',
    totalAnswers: answers.length,
    accepted: answers.filter(a => a.isAccepted).length,
    pending: answers.filter(a => !a.isAccepted).length,
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
        <Typography variant="h4" fontWeight={700} color="#2563EB" mb={3}>
          My Answers
        </Typography>
        {answers.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center', background: '#F1F5F9' }}>
            <Typography variant="h6" color="text.secondary">You haven't answered any questions yet.</Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {answers.map(a => (
              <Paper key={a._id} elevation={2} sx={{ p: 3, borderRadius: 3, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    {a.isAccepted ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <HourglassEmptyIcon color="warning" fontSize="small" />
                    )}
                    <Typography variant="h6" fontWeight={700} color="#111827">Answer to Question</Typography>
                    {a.isAccepted && (
                      <Chip
                        label="Accepted"
                        color="success"
                        size="small"
                        sx={{ ml: 1, fontWeight: 600 }}
                      />
                    )}
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mb={1} sx={{ maxWidth: 700 }}>
                    {a.answerText}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Answered on {new Date(a.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                {/* Right status box */}
                <Box sx={{ minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-start', mt: 1 }}>
                  {/* Only show Accepted chip if accepted, otherwise nothing */}
                  {a.isAccepted && (
                    <Chip label="Accepted" color="success" size="small" icon={<CheckCircleIcon />} sx={{ mt: 1 }} />
                  )}
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="small" 
                    sx={{ mt: 1 }}
                    onClick={() => navigate(`/qa/question/${a.questionObjectId || a.questionId}`)}
                  >
                    View Question
                  </Button>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
    </Box>
  );
} 