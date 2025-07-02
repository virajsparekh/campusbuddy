import React, { useRef, useState } from 'react';
import { Box, Card, Typography, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Header from '../common/Header';
import Footer from '../common/Footer';

const demoSubjects = ['Physics', 'Math', 'CS', 'Biology'];
const demoColleges = ['ABC University', 'XYZ College', 'CampusBuddy Institute'];

export default function UploadMaterials() {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [college, setCollege] = useState('');
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
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Demo upload: ' + (file ? file.name : 'No file selected'));
  };

  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--cb-bg, #F1F5F9)', zIndex: 1 }}>
      <Header />
      <Card sx={{ maxWidth: 800, width: '100%', borderRadius: 4, boxShadow: 6, p: 0, overflow: 'hidden' }}>
        <Box sx={{ background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)', p: 5, pb: 3 }}>
          <Typography variant="h5" fontWeight={700} color="#fff" mb={0.5}>
            <CloudUploadIcon sx={{ verticalAlign: 'middle', mr: 1, color: '#fff' }} />
            Upload Study Material
          </Typography>
          <Typography variant="body2" color="#E5E7EB" fontWeight={500}>
            Share your notes, slides, or resources with your peers. Accepted: PDF, PPT, Images.
          </Typography>
        </Box>
        <Box sx={{ p: 5 }}>
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
                onChange={handleFileChange}
                accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png"
              />
              <CloudUploadIcon sx={{ fontSize: 40, color: '#2563EB', mb: 1 }} />
              <Typography variant="subtitle1" color="#2563EB" fontWeight={600}>
                Drag & drop your file here, or <span style={{ textDecoration: 'underline', color: '#2563EB' }}>click to select</span>
              </Typography>
              <Typography variant="caption" color="#2563EB">
                PDF, PPT, PPTX, Images (max 10MB, demo only)
              </Typography>
              {file && (
                <Typography variant="body2" color="#10B981" mt={1}>
                  Selected: {file.name}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select value={subject} label="Subject" onChange={e => setSubject(e.target.value)} required>
                  <MenuItem value=""><em>Select Subject</em></MenuItem>
                  {demoSubjects.map(subj => <MenuItem key={subj} value={subj}>{subj}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>College</InputLabel>
                <Select value={college} label="College" onChange={e => setCollege(e.target.value)} required>
                  <MenuItem value=""><em>Select College</em></MenuItem>
                  {demoColleges.map(col => <MenuItem key={col} value={col}>{col}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, fontWeight: 700, fontSize: 18, py: 1.5, background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)' }} startIcon={<CloudUploadIcon />}>
              Upload
            </Button>
          </form>
        </Box>
      </Card>
      <Footer />
    </Box>
  );
} 