import React from 'react';
import { Box, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Avatar } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Header from '../common/Header';
import Footer from '../common/Footer';

const demoUploads = [
  { file: 'road.jpeg', type: 'IMG', subject: 'Physics', college: 'ABC University', url: '#' },
  { file: 'notes.pdf', type: 'PDF', subject: 'Math', college: 'XYZ College', url: '#' },
];

export default function MyUploads() {
  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--cb-bg, #F1F5F9)', zIndex: 1 }}>
      <Header />
      <Card sx={{ width: '100%', maxWidth: 900, borderRadius: 4, boxShadow: 6, p: 5 }}>
        <Typography variant="h6" fontWeight={700} color="#2563EB" mb={2}>
          My Uploaded Materials
        </Typography>
        <TableContainer sx={{ p: 2 }}>
          <Table>
            <TableHead >
              <TableRow sx={{ background: '#DBEAFE' }}>
                <TableCell sx={{ fontWeight: 700, color: '#2563EB' }}>File</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#2563EB' }}>Subject</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#2563EB' }}>College</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#2563EB' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {demoUploads.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: '#F59E0B', width: 32, height: 32, fontWeight: 700, fontSize: 16 }}>
                        {row.type}
                      </Avatar>
                      <Typography color="#2563EB" fontWeight={600}>{row.file}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row.subject}</TableCell>
                  <TableCell>{row.college}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" href={row.url} sx={{ fontWeight: 600, borderRadius: 2, px: 3 }}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Footer />
    </Box>
  );
} 