import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, CircularProgress, Chip } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import AdminLayout from './AdminLayout';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { getImageUrl, isValidImageUrl, handleImageError } from '../../utils/imageUtils';
import { getApiUrl } from '../../utils/api';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getApiUrl('/api/admin/dashboard'), {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ 
          p: 4, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh'
        }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Box sx={{ p: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </AdminLayout>
    );
  }

  // Prepare data for charts
  const stats = dashboardData ? [
    { 
      label: 'Total Events', 
      value: dashboardData.stats.totalEvents, 
      icon: <EventIcon />, 
      bg: 'linear-gradient(to right, #f7971e, #ffd200)', 
      trend: 'Live data' 
    },
    { 
      label: 'Total Users', 
      value: dashboardData.stats.totalUsers, 
      icon: <PeopleIcon />, 
      bg: 'linear-gradient(to right, #667eea, #5ec6ca)', 
      trend: 'Live data' 
    },
    { 
      label: 'Premium Users', 
      value: dashboardData.stats.premiumUsers, 
      icon: <StarIcon />, 
      bg: 'linear-gradient(to right, #f857a6, #ff5858)', 
      trend: 'Live data' 
    },
  ] : [];

  const pieData = dashboardData ? [
    { name: 'Premium', value: dashboardData.stats.premiumUsers },
    { name: 'Free', value: dashboardData.stats.totalUsers - dashboardData.stats.premiumUsers },
  ] : [];

  const barData = dashboardData ? [
    { name: 'Events', value: dashboardData.stats.totalEvents },
    { name: 'Users', value: dashboardData.stats.totalUsers },
    { name: 'Premium', value: dashboardData.stats.premiumUsers },
  ] : [];

  // Generate sample activity data for the last 7 days
  const activityData = dashboardData ? Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      users: Math.floor(Math.random() * 10) + 5,
      events: Math.floor(Math.random() * 5) + 1
    };
  }) : [];

  const latestEvent = dashboardData?.recentEvents?.[0];

  return (
    <AdminLayout>
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" fontWeight={700}>Admin Dashboard</Typography>
          <Avatar src="https://i.pravatar.cc/40" alt="Admin" />
        </Box>

        <Grid container spacing={4}>
          {stats.map((item) => (
            <Grid item xs={12} md={4} key={item.label}>
              <Card sx={{ 
                p: 4, 
                borderRadius: 4, 
                background: item.bg, 
                color: 'white',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h3" fontWeight={700}>{item.value}</Typography>
                    <Box sx={{ fontSize: '2.5rem', opacity: 0.8 }}>
                      {item.icon}
                    </Box>
                  </Box>
                  <Typography variant="h6" fontWeight={600}>{item.label}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>{item.trend}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4} sx={{ mt: 6 }}>
          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              p: 4, 
              borderRadius: 4, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              height: '400px'
            }}>
              <Typography variant="h5" fontWeight={700} mb={3} color="#1f2937">Users Breakdown</Typography>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie 
                    data={pieData} 
                    dataKey="value" 
                    nameKey="name" 
                    outerRadius={120} 
                    innerRadius={60}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#ff6384', '#36a2eb'][index % 2]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Users']} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              p: 4, 
              borderRadius: 4, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              height: '400px'
            }}>
              <Typography variant="h5" fontWeight={700} mb={3} color="#1f2937">Platform Activity</Typography>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [value, 'Count']} />
                  <Bar 
                    dataKey="value" 
                    fill="linear-gradient(45deg, #3b82f6, #1d4ed8)" 
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              p: 4, 
              borderRadius: 4, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              height: '400px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h5" fontWeight={700} mb={3} color="#1f2937">Latest Event</Typography>
              {latestEvent ? (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {isValidImageUrl(latestEvent.imageUrl) && (
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                      <img 
                        src={getImageUrl(latestEvent.imageUrl)}
                        alt={latestEvent.title}
                        style={{ 
                          width: '100%', 
                          height: '180px', 
                          borderRadius: '12px',
                          objectFit: 'cover',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }} 
                        onError={(e) => handleImageError(e, latestEvent.imageUrl)}
                      />
                    </Box>
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600} mb={2} color="#1f2937">
                      {latestEvent.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        📍 {latestEvent.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        📅 {new Date(latestEvent.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip 
                      label={latestEvent.isPremiumOnly ? 'Premium Event' : 'Free Event'} 
                      color={latestEvent.isPremiumOnly ? 'error' : 'success'}
                      size="small"
                    />
                  </Box>
                </Box>
              ) : (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    No events found
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Recent Activity Section */}
        <Grid container spacing={4} sx={{ mt: 6 }}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ 
              p: 4, 
              borderRadius: 4, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              height: '400px'
            }}>
              <Typography variant="h5" fontWeight={700} mb={3} color="#1f2937">Weekly Activity</Typography>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value, name) => [value, name === 'users' ? 'New Users' : 'New Events']} />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="events" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              p: 4, 
              borderRadius: 4, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              height: '400px'
            }}>
              <Typography variant="h5" fontWeight={700} mb={3} color="#1f2937">Recent Users</Typography>
              <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
                {dashboardData?.recentUsers?.slice(0, 5).map((user, index) => (
                  <Box 
                    key={user._id} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 2, 
                      mb: 2, 
                      borderRadius: 2,
                      bgcolor: index % 2 === 0 ? '#f8fafc' : 'transparent',
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: '#f1f5f9' }
                    }}
                  >
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: '#3b82f6', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 600,
                      mr: 2
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight={600} color="#1f2937">
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                    <Chip 
                      label={user.role} 
                      size="small"
                      color={user.role === 'admin' ? 'error' : 'primary'}
                    />
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
}