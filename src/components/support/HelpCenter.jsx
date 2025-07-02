import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, TextField, InputAdornment, Accordion, AccordionSummary, AccordionDetails, Container, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Header from '../common/Header';
import Footer from '../common/Footer';

const helpTopics = [
  {
    category: 'Account & Security',
    topics: [
      {
        question: 'How do I reset my password?',
        answer: 'Go to the login page, click on "Forgot Password?", and follow the instructions to reset your password via email.'
      },
      {
        question: 'How do I upgrade to premium?',
        answer: 'Visit your Account Settings and click on "Upgrade to Premium". Follow the payment instructions to unlock premium features.'
      },
      {
        question: 'How do I delete my account?',
        answer: 'Go to Account Settings, scroll down to "Delete Account", and follow the instructions. Please note this action is irreversible.'
      }
    ]
  },
  {
    category: 'Community Q&A',
    topics: [
      {
        question: 'How do I post a question in the Community Q&A?',
        answer: 'Navigate to Community Q&A > Post Question from the menu. Fill out the form with your question, add relevant tags, and submit.'
      },
      {
        question: 'How do I answer questions?',
        answer: 'Browse questions in the Community Q&A section and click on any question to view details and add your answer.'
      }
    ]
  },
  {
    category: 'Marketplace',
    topics: [
      {
        question: 'How do I post a listing?',
        answer: 'Go to Marketplace > Post Listing, fill out the form with details, add photos, and submit your listing.'
      },
      {
        question: 'How do I mark an item as sold?',
        answer: 'In My Listings, find your item and click "Mark as Sold" to update the listing status.'
      }
    ]
  },
  {
    category: 'General',
    topics: [
      {
        question: 'How do I contact support?',
        answer: 'You can reach out to us via the Contact Us page or email us at support@campusbuddy.com.'
      },
      {
        question: 'What are premium features?',
        answer: 'Premium features include priority listings, advanced analytics, and access to exclusive events and content.'
      }
    ]
  }
];

export default function HelpCenter() {
  const [search, setSearch] = useState('');
  
  const filteredCategories = helpTopics.map(category => ({
    ...category,
    topics: category.topics.filter(topic =>
      topic.question.toLowerCase().includes(search.toLowerCase()) ||
      topic.answer.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(category => category.topics.length > 0);

  return (
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        width: '100vw'
      }}>
      <Header />

        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              mb: 3
            }}>
              <HelpOutlineIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant="h3" fontWeight={700} color="white" mb={2}>
              Help Center
            </Typography>
            <Typography variant="h6" color="rgba(255, 255, 255, 0.9)" sx={{ maxWidth: 600, mx: 'auto' }}>
              Find answers to common questions and get the support you need
            </Typography>
          </Box>

          <Paper sx={{ 
            borderRadius: 4, 
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ p: 4, background: '#f8fafc' }}>
              <TextField
                fullWidth
                size="large"
                placeholder="Search for help topics..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  background: 'white',
                  borderRadius: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
              />
            </Box>

            <Box sx={{ p: 4 }}>
              {filteredCategories.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary" mb={2}>
                    No help topics found
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Try searching with different keywords
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={4}>
                  {filteredCategories.map((category, categoryIndex) => (
                    <Box key={categoryIndex}>
                      <Typography variant="h5" fontWeight={600} color="#2563EB" mb={3}>
                        {category.category}
                      </Typography>
                      <Stack spacing={2}>
                        {category.topics.map((topic, topicIndex) => (
                          <Accordion 
                            key={topicIndex} 
                            sx={{ 
                              borderRadius: 2,
                              border: '1px solid #e2e8f0',
                              '&:before': { display: 'none' },
                              '&:hover': {
                                borderColor: '#2563EB',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)'
                              }
                            }}
                          >
                            <AccordionSummary 
                              expandIcon={<ExpandMoreIcon />}
                              sx={{ 
                                '&:hover': { background: '#f8fafc' },
                                borderRadius: 2
                              }}
                            >
                              <Typography fontWeight={600} color="#1e293b">
                                {topic.question}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ background: '#f8fafc' }}>
                              <Typography color="#64748b" lineHeight={1.6}>
                                {topic.answer}
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Stack>
                      {categoryIndex < filteredCategories.length - 1 && (
                        <Divider sx={{ mt: 4, mb: 2 }} />
                      )}
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Paper>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="h6" color="white" mb={2}>
              Still need help?
            </Typography>
            <Typography variant="body1" color="rgba(255, 255, 255, 0.8)" sx={{ maxWidth: 500, mx: 'auto' }}>
              Can't find what you're looking for? Contact our support team and we'll get back to you as soon as possible.
            </Typography>
          </Box>
        </Container>
        <Footer />
      </Box>
  );
} 