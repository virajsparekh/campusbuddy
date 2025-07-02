import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Tabs, Tab, Button, Container } from '@mui/material';
import Header from '../common/Header';
import Footer from '../common/Footer';
import EditProfile from './EditProfile';
import ViewProfile from './ViewProfile';
import AccountSettings from './AccountSettings';

const demoUser = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  studentId: 'S123456',
  role: 'student',
  isPremium: true,
  premiumExpiry: '2024-12-31',
  college: { name: 'Sample College', type: 'Public', province: 'Ontario' },
};

export default function UserProfile() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', background: 'var(--cb-bg, #F1F5F9)' }}>
      <Header />
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" fontWeight={700} color="#2563EB" mb={3} align="center">
              👤 User Profile
            </Typography>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="fullWidth"
              sx={{ mb: 3 }}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="View Profile" />
              <Tab label="Edit Profile" />
              <Tab label="Account Settings" />
            </Tabs>
            {tab === 0 && <ViewProfile user={demoUser} />}
            {tab === 1 && <EditProfile user={demoUser} />}
            {tab === 2 && <AccountSettings user={demoUser} />}
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Box>
  );
}
