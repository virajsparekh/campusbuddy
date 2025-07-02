import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import AdminSidebar from './AdminSidebar';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
  { label: 'Total Events', value: 32, icon: <EventIcon />, bg: 'linear-gradient(to right, #f7971e, #ffd200)', trend: '+12% this month' },
  { label: 'Total Users', value: 1245, icon: <PeopleIcon />, bg: 'linear-gradient(to right, #667eea, #5ec6ca)', trend: '+8% this month' },
  { label: 'Premium Users', value: 210, icon: <StarIcon />, bg: 'linear-gradient(to right, #f857a6, #ff5858)', trend: '+5% this month' },
];

const pieData = [
  { name: 'Premium', value: 210 },
  { name: 'Free', value: 1035 },
];

const barData = [
  { name: 'Events', value: 32 },
  { name: 'Users', value: 1245 },
  { name: 'Premium', value: 210 },
];

export default function AdminDashboard() {
  return (
    <Box sx={{ display: 'flex', bgcolor: '#f9fafb', minHeight: '100vh', width: '100vw' }}>
      <AdminSidebar />
      <Box sx={{ flex: 1, p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" fontWeight={700}>Admin Dashboard</Typography>
          <Avatar src="https://i.pravatar.cc/40" alt="Admin" />
        </Box>

        <Grid container spacing={3}>
          {stats.map((item) => (
            <Grid item xs={12} sm={4} key={item.label}>
              <Card sx={{ p: 3, borderRadius: 3, background: item.bg, color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h5" fontWeight={700}>{item.value}</Typography>
                    {item.icon}
                  </Box>
                  <Typography>{item.label}</Typography>
                  <Typography variant="caption">{item.trend}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="h6" mb={2}>Users Breakdown</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#ff6384', '#36a2eb'][index % 2]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="h6" mb={2}>Platform Activity</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="h6" mb={2}>Latest Event</Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>Spacious 2BHK Meetup</Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>📍 Greenwood Apartments</Typography>
              <Typography variant="body2" color="text.secondary">📅 June 28, 2025</Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}