import React, { useRef, useState } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Button, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl,
  TextField,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { useAuth } from '../../context/AuthContext';

const demoSubjects = ['Physics', 'Math', 'Computer Science', 'Biology', 'Chemistry', 'Engineering', 'Business', 'Arts', 'Literature', 'History'];
const demoSemesters = ['Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025'];

export default function UploadMaterials() {
  const { user, token } = useAuth();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleClick = () => fileInputRef.current.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title for the material');
      return;
    }

    if (!subject) {
      setError('Please select a subject');
      return;
    }

    if (!semester) {
      setError('Please select a semester');
      return;
    }

    try {
  
      setUploading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('subject', subject);
      formData.append('semester', semester);
      if (tags.trim()) {
        formData.append('tags', tags);
      }

      if (!token) {
        setError('No authentication token found. Please log in.');
        setUploading(false);
        return;
      }

      
      
      const response = await fetch('http://localhost:5001/api/studyhub/materials', {
        method: 'POST',
        headers: {
          'x-auth-token': token
        },
        body: formData
      });

      

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload error:', errorData);
        throw new Error(errorData.msg || 'Failed to upload material');
      }

      const result = await response.json();
      
      setSuccess('Material uploaded successfully!');
      
      // Reset form
      setFile(null);
      setTitle('');
      setSubject('');
      setSemester('');
      setTags('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error uploading material:', err);
      setError(err.message || 'Failed to upload material. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleTagInput = (e) => {
    setTags(e.target.value);
  };

  const getFileSize = (file) => {
    if (!file) return '';
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    return `${sizeInMB} MB`;
  };

  const getFileType = (file) => {
    if (!file) return '';
    return file.name.split('.').pop()?.toUpperCase() || '';
  };

  const isFileValid = (file) => {
    if (!file) return false;
    
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/avi',
      'audio/mpeg',
      'audio/wav'
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a document, image, video, or audio file.');
      return false;
    }

    if (file.size > maxSize) {
      setError('File size too large. Maximum size is 10MB.');
      return false;
    }

    return true;
  };

  const handleFileSelect = (selectedFile) => {
    setError('');
    if (isFileValid(selectedFile)) {
      setFile(selectedFile);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--cb-bg, #F1F5F9)' }}>
      <Header />
      <Box sx={{ flex: 1, py: 4, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ maxWidth: 800, width: '100%', borderRadius: 4, boxShadow: 6, p: 0, overflow: 'hidden', mx: 2 }}>
        <Box sx={{ background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)', p: 5, pb: 3 }}>
          <Typography variant="h5" fontWeight={700} color="#fff" mb={0.5}>
            <CloudUploadIcon sx={{ verticalAlign: 'middle', mr: 1, color: '#fff' }} />
            Upload Study Material
          </Typography>
          <Typography variant="body2" color="#E5E7EB" fontWeight={500}>
            Share your notes, slides, or resources with your peers. Accepted: PDF, DOC, PPT, Images, Videos, Audio.
          </Typography>
        </Box>
        <Box sx={{ p: 5 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleClick}
              sx={{
                border: '2px dashed #2563EB',
                borderRadius: 3,
                background: '#F5F8FF',
                textAlign: 'center',
                py: 4,
                mb: 3,
                cursor: 'pointer',
                transition: 'border 0.2s',
                '&:hover': { borderColor: '#3B82F6' },
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e.target.files[0])}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mp3,.wav"
              />
              <CloudUploadIcon sx={{ fontSize: 40, color: '#2563EB', mb: 1 }} />
              <Typography variant="subtitle1" color="#2563EB" fontWeight={600}>
                Drag & drop your file here, or <span style={{ textDecoration: 'underline', color: '#2563EB' }}>click to select</span>
              </Typography>
              <Typography variant="caption" color="#2563EB">
                PDF, DOC, PPT, Images, Videos, Audio (max 10MB)
              </Typography>
              {file && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#E0F2FE', borderRadius: 2 }}>
                  <Typography variant="body2" color="#0277BD" fontWeight={600}>
                    Selected: {file.name}
                  </Typography>
                  <Typography variant="caption" color="#0277BD">
                    Type: {getFileType(file)} | Size: {getFileSize(file)}
                  </Typography>
                </Box>
              )}
            </Box>

            <TextField
              label="Material Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              sx={{ mb: 3 }}
              placeholder="Enter a descriptive title for your material"
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select value={subject} label="Subject" onChange={e => setSubject(e.target.value)} required>
                  <MenuItem value=""><em>Select Subject</em></MenuItem>
                  {demoSubjects.map(subj => <MenuItem key={subj} value={subj}>{subj}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Semester</InputLabel>
                <Select value={semester} label="Semester" onChange={e => setSemester(e.target.value)} required>
                  <MenuItem value=""><em>Select Semester</em></MenuItem>
                  {demoSemesters.map(sem => <MenuItem key={sem} value={sem}>{sem}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Tags (optional)"
              value={tags}
              onChange={handleTagInput}
              fullWidth
              sx={{ mb: 3 }}
              placeholder="Enter tags separated by commas (e.g., notes, chapter1, exam)"
              helperText="Tags help others find your material more easily"
            />

            {tags && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Preview tags:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {tags.split(',').map((tag, index) => (
                    tag.trim() && (
                      <Chip 
                        key={index} 
                        label={tag.trim()} 
                        size="small" 
                        sx={{ bgcolor: '#DBEAFE', color: '#2563EB' }} 
                      />
                    )
                  ))}
                </Box>
              </Box>
            )}

            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              disabled={uploading}
              sx={{ 
                mt: 2, 
                fontWeight: 700, 
                fontSize: 18, 
                py: 1.5, 
                background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
                '&:disabled': {
                  background: '#9CA3AF'
                }
              }} 
              startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
            >
              {uploading ? 'Uploading...' : 'Upload Material'}
            </Button>
          </form>
        </Box>
      </Card>
    </Box>
      <Footer />
    </Box>
  );
} 