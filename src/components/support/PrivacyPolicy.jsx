import React from 'react';
import { Box, Typography, Stack, Paper, Container, Divider } from '@mui/material';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import CookieIcon from '@mui/icons-material/Cookie';
import ShareIcon from '@mui/icons-material/Share';
import SecurityIcon from '@mui/icons-material/Security';
import UpdateIcon from '@mui/icons-material/Update';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import Header from '../common/Header';
import Footer from '../common/Footer';

const sections = [
  {
    icon: <DataUsageIcon sx={{ fontSize: 30, color: '#2563EB' }} />,
    title: '1. Data Collection',
    text: 'We collect information you provide when you register, post content, or interact with CampusBuddy. This includes personal information such as your name, email address, and profile information, as well as usage data and content you create.'
  },
  {
    icon: <DataUsageIcon sx={{ fontSize: 30, color: '#2563EB' }} />,
    title: '2. Use of Data',
    text: 'Your data is used to provide and improve our services, personalize your experience, and communicate with you. We may also use aggregated, anonymized data for analytics and research purposes to enhance our platform.'
  },
  {
    icon: <CookieIcon sx={{ fontSize: 30, color: '#2563EB' }} />,
    title: '3. Cookies and Tracking',
    text: 'We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze how you use our platform. You can control cookies through your browser settings, though this may affect some functionality.'
  },
  {
    icon: <ShareIcon sx={{ fontSize: 30, color: '#2563EB' }} />,
    title: '4. Third-Party Services',
    text: 'We may share data with trusted third-party services for analytics, payment processing, and functionality. We do not sell your personal data to third parties. All third-party services are bound by confidentiality agreements.'
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 30, color: '#2563EB' }} />,
    title: '5. Data Security',
    text: 'We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.'
  },
  {
    icon: <UpdateIcon sx={{ fontSize: 30, color: '#2563EB' }} />,
    title: '6. Changes to Policy',
    text: 'We may update this Privacy Policy from time to time. Continued use of CampusBuddy after changes means you accept the updated policy. We will notify users of significant changes via email or platform notification.'
  },
  {
    icon: <ContactSupportIcon sx={{ fontSize: 30, color: '#2563EB' }} />,
    title: '7. Contact Information',
    text: 'For privacy questions or to exercise your data rights, contact us at support@campusbuddy.com. We aim to respond to all privacy-related inquiries within 48 hours during business days.'
  },
];

export default function PrivacyPolicy() {
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
              <PrivacyTipIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant="h3" fontWeight={700} color="white" mb={2}>
              Privacy Policy
            </Typography>
            <Typography variant="h6" color="rgba(255, 255, 255, 0.9)" sx={{ maxWidth: 600, mx: 'auto' }}>
              How we collect, use, and protect your personal information
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
                This Privacy Policy describes how CampusBuddy collects, uses, and protects your personal information when you use our platform.
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
              Questions about your privacy?
            </Typography>
            <Typography variant="body1" color="rgba(255, 255, 255, 0.8)" sx={{ maxWidth: 500, mx: 'auto' }}>
              If you have any questions about this Privacy Policy or your data rights, please contact our privacy team.
            </Typography>
          </Box>
        </Container>
        <Footer />
      </Box>
  );
} 