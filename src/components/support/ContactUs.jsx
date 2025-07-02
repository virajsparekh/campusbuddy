import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Stack, Container, Grid } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Header from '../common/Header';
import Footer from '../common/Footer';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 30, color: '#2563EB' }} />,
      title: 'Email Us',
      detail: 'support@campusbuddy.com',
      subtitle: 'We\'ll respond within 24 hours'
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 30, color: '#2563EB' }} />,
      title: 'Call Us',
      detail: '+1 (555) 123-4567',
      subtitle: 'Mon-Fri 9AM-6PM EST'
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 30, color: '#2563EB' }} />,
      title: 'Visit Us',
      detail: '123 Campus Drive',
      subtitle: 'University District, CA 90210'
    }
  ];

  return (
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        width: '100vw',
      }}>
      <Header />
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" fontWeight={700} color="white" mb={2}>
              Contact Us
            </Typography>
            <Typography variant="h6" color="rgba(255, 255, 255, 0.9)" sx={{ maxWidth: 600, mx: 'auto' }}>
              Have a question or need help? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </Typography>
          </Box>

          <Paper sx={{ borderRadius: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', maxWidth: 1000, mx: 'auto', p: { xs: 2, sm: 4 } }}>
            <Grid container spacing={0} alignItems="stretch">
              <Grid item xs={12} md={7} sx={{ borderRight: { md: '1px solid #e5e7eb' }, pr: { md: 4 }, py: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" fontWeight={600} color="#1e293b" mb={1}>
                    Send us a message
                  </Typography>
                  <Typography variant="body1" color="#64748b">
                    Fill out the form below and we'll get back to you soon.
                  </Typography>
                </Box>
                {submitted ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                    <Typography variant="h5" color="success.main" fontWeight={600} mb={2}>
                      Message Sent Successfully!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </Typography>
                  </Box>
                ) : (
                  <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Full Name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Email Address"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          fullWidth
                          type="email"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Subject"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          required
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Message"
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          required
                          fullWidth
                          multiline
                          rows={6}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button 
                          type="submit" 
                          variant="contained" 
                          size="large" 
                          startIcon={<SendIcon />}
                          sx={{ borderRadius: 2, py: 1.5, px: 4, fontSize: '1.1rem', alignSelf: 'flex-start' }}
                        >
                          Send Message
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Grid>
              <Grid item xs={12} md={5} sx={{ pl: { md: 4 }, pt: { xs: 4, md: 0 }, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <Stack spacing={3} sx={{ width: '100%' }}>
                  {contactInfo.map((info, index) => (
                    <Paper key={index} sx={{ p: 3, borderRadius: 3, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {info.icon}
                        <Typography variant="h6" fontWeight={600} color="#1e293b" ml={2}>
                          {info.title}
                        </Typography>
                      </Box>
                      <Typography variant="body1" color="#2563EB" fontWeight={500} mb={1}>
                        {info.detail}
                      </Typography>
                      <Typography variant="body2" color="#64748b">
                        {info.subtitle}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="h6" color="white" mb={2}>
              Need immediate assistance?
            </Typography>
            <Typography variant="body1" color="rgba(255, 255, 255, 0.8)" sx={{ maxWidth: 500, mx: 'auto' }}>
              Check out our Help Center for quick answers to common questions.
            </Typography>
          </Box>
        </Container>
        <Footer />
      </Box>
  );
} 