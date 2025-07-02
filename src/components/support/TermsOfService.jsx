import React from 'react';
import { Box, Typography, Stack, Paper, Container, Divider } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import SecurityIcon from '@mui/icons-material/Security';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BlockIcon from '@mui/icons-material/Block';
import UpdateIcon from '@mui/icons-material/Update';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import Header from '../common/Header';
import Footer from '../common/Footer';

const sections = [
  {
    icon: <GavelIcon sx={{ fontSize: 30, color: '#2563EB' }} />,
    title: '1. Acceptance of Terms',
    text: 'By accessing or using CampusBuddy, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.'
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 30, color: '#2563EB' }} />,
    title: '2. User Conduct',
    text: 'You agree not to misuse the platform, post inappropriate content, or engage in any activity that violates our community guidelines. This includes but is not limited to harassment, spam, illegal activities, or content that infringes on others\' rights.'
  },
  {
    icon: <ContentCopyIcon sx={{ fontSize: 30, color: '#2563EB' }} />,
    title: '3. Content and Intellectual Property',
    text: 'You are responsible for the content you post. CampusBuddy reserves the right to remove any content that violates our policies. You retain ownership of your content but grant us a license to use it for platform purposes.'
  },
  {
    icon: <BlockIcon sx={{ fontSize: 30, color: '#2563EB' }} />,
    title: '4. Account Termination',
    text: 'We may suspend or terminate your access to CampusBuddy at any time for violations of these terms, fraudulent activity, or for any other reason at our sole discretion. Upon termination, your right to use the platform ceases immediately.'
  },
  {
    icon: <UpdateIcon sx={{ fontSize: 30, color: '#2563EB' }} />,
    title: '5. Changes to Terms',
    text: 'We reserve the right to update these Terms of Service at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of significant changes via email or platform notification.'
  },
  {
    icon: <ContactSupportIcon sx={{ fontSize: 30, color: '#2563EB' }} />,
    title: '6. Contact Information',
    text: 'For questions about these terms, contact us at support@campusbuddy.com. We aim to respond to all inquiries within 24 hours during business days.'
  },
];

export default function TermsOfService() {
  return (
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        width: '100vw',
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
              <GavelIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant="h3" fontWeight={700} color="white" mb={2}>
              Terms of Service
            </Typography>
            <Typography variant="h6" color="rgba(255, 255, 255, 0.9)" sx={{ maxWidth: 600, mx: 'auto' }}>
              Please read these terms carefully before using CampusBuddy
            </Typography>
          </Box>

          <Paper sx={{ 
            borderRadius: 4, 
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ p: 4, background: '#f8fafc' }}>
              <Typography variant="h5" fontWeight={600} color="#1e293b" mb={1}>
                Last Updated: June 2025
              </Typography>
              <Typography variant="body1" color="#64748b">
                These Terms of Service govern your use of CampusBuddy and constitute a legally binding agreement between you and CampusBuddy.
              </Typography>
            </Box>

            <Box sx={{ p: 4 }}>
              <Stack spacing={4}>
                {sections.map((section, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: '#f1f5f9',
                        mr: 3,
                        flexShrink: 0
                      }}>
                        {section.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" fontWeight={600} color="#1e293b" mb={2}>
                          {section.title}
                        </Typography>
                        <Typography variant="body1" color="#64748b" lineHeight={1.7}>
                          {section.text}
                        </Typography>
                      </Box>
                    </Box>
                    {index < sections.length - 1 && (
                      <Divider sx={{ mt: 4, mb: 2 }} />
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Paper>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="h6" color="white" mb={2}>
              Questions about our terms?
            </Typography>
            <Typography variant="body1" color="rgba(255, 255, 255, 0.8)" sx={{ maxWidth: 500, mx: 'auto' }}>
              If you have any questions about these Terms of Service, please don't hesitate to contact our support team.
            </Typography>
          </Box>
        </Container>
        <Footer />
      </Box>
  );
} 