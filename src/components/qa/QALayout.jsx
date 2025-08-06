import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/api';
import { Box, Paper, Typography, Stack, Button, Avatar } from '@mui/material';
import { Outlet, Link, useLocation } from 'react-router-dom';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Header from '../common/Header';
import { useAuth } from '../../context/AuthContext';

const leftNav = [
  { label: 'Questions', icon: <ListAltIcon />, link: '/qa/browse' },
  { label: 'My Questions', icon: <AssignmentIndIcon />, link: '/qa/my-questions' },
  { label: 'My Answers', icon: <QuestionAnswerIcon />, link: '/qa/my-answers' },
  { label: 'Ask Question', icon: <AddCircleOutlineIcon />, link: '/qa/ask' },
];

export default function QALayout() {
  const location = useLocation();
  const { user } = useAuth();
  const [profileStats, setProfileStats] = useState({
    totalQuestions: 0,
    totalAnswers: 0,
    answeredQuestions: 0,
    openQuestions: 0,
    acceptedAnswers: 0
  });

  // Fetch user's QA stats
  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Fetch user's questions
      const questionsResponse = await fetch(getApiUrl('/api/qa/my-questions'), {
        headers: { 'x-auth-token': token }
      });
      
      // Fetch user's answers
      const answersResponse = await fetch(getApiUrl('/api/qa/my-answers'), {
        headers: { 'x-auth-token': token }
      });

      if (questionsResponse.ok && answersResponse.ok) {
        const questionsData = await questionsResponse.json();
        const answersData = await answersResponse.json();
        
        const questions = questionsData.questions || [];
        const answers = answersData.answers || [];
        
        setProfileStats({
          totalQuestions: questions.length,
          totalAnswers: answers.length,
          answeredQuestions: questions.filter(q => q.status === 'Answered').length,
          openQuestions: questions.filter(q => q.status === 'Open').length,
          acceptedAnswers: answers.filter(a => a.isAccepted).length
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  return (
    <Box sx={{ background: 'var(--cb-bg, #F1F5F9)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw' }}>
      <Header />
      <Box sx={{ width: '100%', maxWidth: 1400, display: 'flex', gap: 6, mx: 'auto', minHeight: '80vh' }}>
        {/* Left Navigation */}
        <Paper elevation={2} sx={{ width: 280, p: 3, borderRadius: 4, height: 'fit-content', position: 'sticky', top: 20 }}>
          <Typography variant="h6" fontWeight={700} mb={3} color="#2563EB">
            Community Q&A
          </Typography>
          <Stack spacing={2}>
            {leftNav.map((item) => (
              <Link key={item.label} to={item.link} style={{ textDecoration: 'none' }}>
                <Button
                  startIcon={item.icon}
                  variant={location.pathname === item.link ? 'contained' : 'text'}

                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    fontWeight: 600,
                    width: '100%',
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </Stack>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </Box>

        {/* Right Profile Sidebar - Hidden on Ask Question page */}
        {location.pathname !== '/qa/ask' && (
          <Paper elevation={2} sx={{ width: 280, p: 3, borderRadius: 4, height: 'fit-content', position: 'sticky', top: 20 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 64, 
                  height: 64, 
                  mb: 1, 
                  bgcolor: 'primary.main', 
                  fontSize: '24px', 
                  fontWeight: 'bold' 
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Typography fontWeight={700} mb={0.5}>{user?.name || 'User'}</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Total Questions: <b>{profileStats.totalQuestions}</b>
              </Typography>
            </Box>
            
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#F1F5F9', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Typography fontWeight={600} color="success.main">
                Total Answered: {profileStats.answeredQuestions}
              </Typography>
              <Typography fontWeight={600} color="primary.main">
                Total Questions: {profileStats.totalQuestions}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2, borderRadius: 2 }} 
                component={Link}
                to="/profile"
              >
                View Profile
              </Button>
            </Paper>
          </Paper>
        )}
      </Box>
    </Box>
  );
} 