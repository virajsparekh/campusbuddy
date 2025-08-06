import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  Avatar,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Pagination
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { useAuth } from '../../context/AuthContext';

export default function MyUploads() {
  const { user, token, loading: authLoading } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMaterials, setTotalMaterials] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    subject: '',
    semester: '',
    tags: ''
  });

  // Debug authentication state and screen size
  useEffect(() => {
    
  }, [user, token, authLoading]);

  // Fetch user's uploaded materials
  const fetchMyUploads = async () => {
    try {

      setLoading(true);
      
      // Wait for authentication to complete
      if (authLoading) {

        return;
      }
      
      if (!token || !user) {

        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`http://localhost:5001/api/studyhub/materials/my-uploads?page=${currentPage}&limit=10`, {
        headers: {
          'x-auth-token': token
        }
      });



      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch your uploads: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      setMaterials(data.materials);
      setTotalPages(data.pagination.totalPages);
      setTotalMaterials(data.pagination.totalMaterials);
    } catch (err) {
      setError(`Failed to load your uploads: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete material
  const handleDelete = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/studyhub/materials/${materialId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (response.ok) {
        setMaterials(prevMaterials => prevMaterials.filter(material => material._id !== materialId));
        setTotalMaterials(prev => prev - 1);
      } else {
        throw new Error('Failed to delete material');
      }
    } catch (err) {
      setError('Failed to delete material. Please try again.');
    }
  };

  // Open edit dialog
  const handleEdit = (material) => {
    setEditingMaterial(material);
    setEditForm({
      title: material.title,
      subject: material.subject,
      semester: material.semester,
      tags: material.tags.join(', ')
    });
    setEditDialogOpen(true);
  };

  // Update material
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/studyhub/materials/${editingMaterial._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedMaterial = await response.json();
        setMaterials(prevMaterials => 
          prevMaterials.map(material => 
            material._id === editingMaterial._id ? updatedMaterial.material : material
          )
        );
        setEditDialogOpen(false);
        setEditingMaterial(null);
      } else {
        throw new Error('Failed to update material');
      }
    } catch (err) {
      setError('Failed to update material. Please try again.');
      console.error('Error updating material:', err);
    }
  };

  // Download material
  const handleDownload = (material) => {
    if (material.fileURL.startsWith('http')) {
      window.open(material.fileURL, '_blank');
    } else {
      window.open(`http://localhost:5001/api/studyhub${material.fileURL}`, '_blank');
    }
  };

  // Get file type from URL
  const getFileType = (fileURL) => {
    const extension = fileURL.split('.').pop()?.toUpperCase();
    return extension || 'FILE';
  };

  // Get file icon color
  const getFileColor = (fileType) => {
    const colors = {
      'PDF': '#DC2626',
      'DOC': '#2563EB',
      'DOCX': '#2563EB',
      'PPT': '#DC2626',
      'PPTX': '#DC2626',
      'XLS': '#059669',
      'XLSX': '#059669',
      'TXT': '#6B7280',
      'JPG': '#F59E0B',
      'JPEG': '#F59E0B',
      'PNG': '#F59E0B',
      'GIF': '#F59E0B',
      'MP4': '#7C3AED',
      'AVI': '#7C3AED',
      'MP3': '#EC4899',
      'WAV': '#EC4899'
    };
    return colors[fileType] || '#6B7280';
  };

  useEffect(() => {
    if (!authLoading) {
      fetchMyUploads();
    }
  }, [currentPage, authLoading]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading && materials.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--cb-bg, #F1F5F9)' }}>
      <Header />
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', p: { xs: 2, sm: 3 }, width: '100%' }}>
        <Card sx={{ 
          width: '100%', 
          maxWidth: { xs: '100%', sm: 1200 }, 
          borderRadius: 4, 
          boxShadow: 6, 
          p: { xs: 2, sm: 5 },
          mx: { xs: 1, sm: 2 }
        }}>
        <Typography variant="h6" fontWeight={700} color="#2563EB" mb={2}>
          My Uploaded Materials ({totalMaterials} materials)
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer sx={{ p: { xs: 1, sm: 2 }, overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ background: '#DBEAFE' }}>
                <TableCell sx={{ fontWeight: 700, color: '#2563EB' }}>File</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#2563EB' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#2563EB' }}>Subject</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#2563EB' }}>Semester</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#2563EB' }}>Tags</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#2563EB' }}>Votes</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#2563EB' }}>Upload Date</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#2563EB' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materials.map((material) => {
                const fileType = getFileType(material.fileURL);
                const fileColor = getFileColor(fileType);
                const fileName = material.fileURL.split('/').pop();
                
                return (
                  <TableRow key={material._id} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                    <TableCell sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: fileColor, width: 32, height: 32, fontWeight: 700, fontSize: 12 }}>
                          {fileType}
                        </Avatar>
                        <Typography color="#2563EB" fontWeight={600} sx={{ fontSize: '0.9rem' }}>
                          {fileName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ p: 2 }}>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {material.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ p: 2 }}>
                      <Typography sx={{ fontSize: '0.9rem' }}>
                        {material.subject}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ p: 2 }}>
                      <Typography sx={{ fontSize: '0.9rem' }}>
                        {material.semester}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {material.tags.slice(0, 2).map(tag => (
                          <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#DBEAFE', color: '#2563EB', fontSize: '0.7rem' }} />
                        ))}
                        {material.tags.length > 2 && (
                          <Chip label={`+${material.tags.length - 2}`} size="small" sx={{ bgcolor: '#F3F4F6', color: '#6B7280', fontSize: '0.7rem' }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ p: 2 }}>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {material.votes}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ p: 2 }}>
                      <Typography sx={{ fontSize: '0.9rem' }}>
                        {new Date(material.uploadDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          onClick={() => handleDownload(material)}
                          sx={{ color: '#2563EB' }}
                          title="Download"
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleEdit(material)}
                          sx={{ color: '#F59E0B' }}
                          title="Edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDelete(material._id)}
                          sx={{ color: '#DC2626' }}
                          title="Delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination 
              count={totalPages} 
              page={currentPage} 
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}

        {materials.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              You haven't uploaded any materials yet.
            </Typography>
          </Box>
        )}
        </Card>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Material</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Subject"
              value={editForm.subject}
              onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
              fullWidth
            />
            <TextField
              label="Semester"
              value={editForm.semester}
              onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })}
              fullWidth
            />
            <TextField
              label="Tags (comma-separated)"
              value={editForm.tags}
              onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
              fullWidth
              helperText="Enter tags separated by commas"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
} 