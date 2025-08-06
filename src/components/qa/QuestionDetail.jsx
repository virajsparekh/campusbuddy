import React, { useState, useEffect, useRef } from 'react';
import { getApiUrl } from '../../utils/api';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  Stack, 
  Button, 
  TextField, 
  Avatar, 
  Divider, 
  Alert, 
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return diff + 's ago';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return date.toLocaleDateString();
}

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [answerError, setAnswerError] = useState('');
  const hasFetchedRef = useRef(false);

  // Fetch question and answers (with view increment)
  const fetchQuestionAndAnswers = async () => {
    // Prevent multiple calls using ref (works with React Strict Mode)
    if (hasFetchedRef.current) {
      return;
    }

    try {
      hasFetchedRef.current = true;
      setLoading(true);
      setError('');

      // Fetch question
      const questionResponse = await fetch(getApiUrl('/api/qa/questions/' + id), {
        headers: {
          'x-auth-token': token
        }
      });

      if (!questionResponse.ok) {
        throw new Error('Failed to fetch question');
      }

      const questionData = await questionResponse.json();
      setQuestion(questionData.question);

      // Fetch answers
      const answersResponse = await fetch(getApiUrl('/api/qa/questions/' + id + '/answers'), {
        headers: {
          'x-auth-token': token
        }
      });

      if (!answersResponse.ok) {
        throw new Error('Failed to fetch answers');
      }

      const answersData = await answersResponse.json();
      setAnswers(answersData.answers);

    } catch (err) {
      setError('Failed to load question. Please try again.');
      // Reset the ref on error so user can retry
      hasFetchedRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  // Refresh question data without incrementing view count
  const refreshQuestionData = async () => {
    try {
      // Fetch answers only (this doesn't increment views)
      const answersResponse = await fetch(getApiUrl('/api/qa/questions/' + id + '/answers'), {
        headers: {
          'x-auth-token': token
        }
      });

      if (answersResponse.ok) {
        const answersData = await answersResponse.json();
        setAnswers(answersData.answers);
        
        // Update question's answer count locally without refetching
        if (question) {
          setQuestion({
            ...question,
            answers: answersData.answers.length
          });
        }
      }
    } catch (err) {
      console.error('Error refreshing question data:', err);
    }
  };

  useEffect(() => {
    if (token && id) {
      fetchQuestionAndAnswers();
    }
  }, [token, id]);

  // Handle answer submission
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    
    if (!answerText.trim()) {
      setAnswerError('Please enter an answer');
      return;
    }

    setAnswerError('');
    setSubmitting(true);

    try {
      const response = await fetch(getApiUrl('/api/qa/questions/' + id + '/answers'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          answerText: answerText.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAnswers([...answers, data.answer]);
        setAnswerText('');
        setAnswerError('');
        
        // Refresh question data without incrementing view count
        refreshQuestionData();
      } else {
        const errorData = await response.json();
        setAnswerError(errorData.message || 'Failed to post answer');
      }
    } catch (err) {
      setAnswerError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle voting on answers
  const handleVote = async (answerId, voteType) => {
    try {
      const response = await fetch(getApiUrl('/api/qa/answers/' + answerId + '/vote'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ voteType })
      });

      if (response.ok) {
        const data = await response.json();
        // Update the answer's vote count
        setAnswers(answers.map(answer => 
          answer._id === answerId 
            ? { ...answer, votes: data.votes }
            : answer
        ));
      }
    } catch (err) {
      // Error handling for voting
    }
  };

  // Handle accepting answer
  const handleAcceptAnswer = async (answerId) => {
    try {
      const response = await fetch(getApiUrl('/api/qa/answers/' + answerId + '/accept'), {
        method: 'POST',
        headers: {
          'x-auth-token': token
        }
      });

      if (response.ok) {
        // Update answers to show accepted status
        setAnswers(answers.map(answer => ({
          ...answer,
          isAccepted: answer._id === answerId
        })));
        
        // Update question status
        if (question) {
          setQuestion({ ...question, status: 'Answered' });
        }
      }
    } catch (err) {
      // Error handling for accepting answer
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!question) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Alert severity="info" sx={{ maxWidth: 600 }}>
          Question not found
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Back Button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/qa/browse')}
        sx={{ mb: 3 }}
      >
        Back to Questions
      </Button>

      {/* Question */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            <strong>{question.views || 0}</strong> views
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>{question.votes || 0}</strong> votes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>{answers.length}</strong> answers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>{question.status || 'Open'}</strong> status
          </Typography>
        </Box>

        {/* Question Content */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="h5" fontWeight={700}>
              {question.title}
            </Typography>
            {question.status === 'Answered' && <CheckCircleIcon color="success" />}
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
            {question.questionText}
          </Typography>

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              {question.tags.map(tag => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Stack>
          )}

          {/* Question Meta */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
            >
              {(question.askedBy?.name || 'U').charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {question.askedBy?.name || 'Unknown'} • {timeAgo(question.createdAt)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Answers Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          {answers.length} Answer{answers.length !== 1 ? 's' : ''}
        </Typography>

        {/* Answers List */}
        {answers.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="body1" color="text.secondary">
              No answers yet. Be the first to answer!
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {answers.map(answer => (
              <Card key={answer._id} elevation={1} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    {/* Answer Stats */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
                      <Typography variant="h6" fontWeight={700}>
                        {answer.votes || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        votes
                      </Typography>
                      
                      {/* Vote Buttons */}
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Tooltip title="Upvote">
                          <IconButton 
                            size="small" 
                            onClick={() => handleVote(answer._id, 'up')}
                          >
                            <ThumbUpIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Downvote">
                          <IconButton 
                            size="small" 
                            onClick={() => handleVote(answer._id, 'down')}
                          >
                            <ThumbDownIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>

                      {/* Accept Button (only for question author) */}
                      {question.askedBy?.userId === user?.userId && (
                        <Button
                          size="small"
                          variant={answer.isAccepted ? "contained" : "outlined"}
                          color="success"
                          startIcon={answer.isAccepted ? <CheckCircleIcon /> : null}
                          onClick={() => handleAcceptAnswer(answer._id)}
                          sx={{ mt: 1, minWidth: 80 }}
                        >
                          {answer.isAccepted ? 'Accepted' : 'Accept'}
                        </Button>
                      )}
                    </Box>

                    {/* Answer Content */}
                    <Box sx={{ flex: 1 }}>
                      {answer.isAccepted && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <CheckCircleIcon color="success" />
                          <Chip label="Accepted Answer" color="success" size="small" />
                        </Box>
                      )}
                      
                      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                        {answer.answerText}
                      </Typography>

                      {/* Answer Meta */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}
                        >
                          {(answer.answeredBy?.name || 'U').charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {answer.answeredBy?.name || 'Unknown'} • {timeAgo(answer.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      {/* Answer Form */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          Your Answer
        </Typography>
        
        <form onSubmit={handleSubmitAnswer}>
          <TextField
            fullWidth
            multiline
            minRows={6}
            placeholder="Write your answer here... Be detailed and helpful!"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            error={!!answerError}
            helperText={answerError}
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting || !answerText.trim()}
            sx={{ borderRadius: 2, px: 4 }}
          >
            {submitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Posting Answer...
              </>
            ) : (
              'Post Answer'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
} 