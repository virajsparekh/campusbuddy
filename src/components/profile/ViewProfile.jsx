import { Card, CardContent, Typography, Avatar, Box, Stack } from '@mui/material';

export default function ViewProfile({ user }) {
  if (!user) return null;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Avatar
        src={user.profileImage || undefined}
        sx={{ width: 90, height: 90, mb: 2, bgcolor: 'primary.main', fontSize: 40 }}
      >
        {!user.profileImage && user.name.split(' ').map(w => w[0]).join('').slice(0,2)}
      </Avatar>
      <Typography variant="h5" fontWeight={700} color="primary" mb={2}>
        {user.name}
      </Typography>
      <Stack spacing={1} sx={{ width: '100%', maxWidth: 350 }}>
        <Typography variant="body1"><b>Email:</b> {user.email}</Typography>
        {user.bio && <Typography variant="body1"><b>Bio:</b> {user.bio}</Typography>}
        {user.studentId && <Typography variant="body1"><b>Student ID:</b> {user.studentId}</Typography>}
        {user.college && (
          <Typography variant="body1"><b>College:</b> {typeof user.college === 'string' ? user.college : user.college.name}</Typography>
        )}
        {user.location && <Typography variant="body1"><b>Location:</b> {user.location}</Typography>}
      </Stack>
    </Box>
  );
}
