import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Chip, 
  Button, 
  Grid, 
  TextField, 
  Avatar,
  Pagination,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../utils/api';

// Custom hook to prevent automatic scrolling
const useScrollPrevention = () => {
  useEffect(() => {
    // Prevent scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top on mount
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, []);
};

export default function BrowseMaterials() {
  const { user, token } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMaterials, setTotalMaterials] = useState(0);
  const containerRef = useRef(null);

  // Use custom scroll prevention hook
  useScrollPrevention();

  // Debug logging
  useEffect(() => {
    
  }, [user, token]);

  // Fetch materials from API
  const fetchMaterials = async () => {
    try {
  
      setLoading(true);
      
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }
      
      let url = getApiUrl(`/api/studyhub/materials?page=${currentPage}&limit=12`);
      
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (selectedSubject) url += `&subject=${encodeURIComponent(selectedSubject)}`;
      if (selectedSemester) url += `&semester=${encodeURIComponent(selectedSemester)}`;
      if (selectedTags.length > 0) url += `&tags=${selectedTags.join(',')}`;

      

      const response = await fetch(url, {
        headers: {
          'x-auth-token': token
        }
      });

      

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch materials: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      setMaterials(data.materials);
      setTotalPages(data.pagination.totalPages);
      setTotalMaterials(data.pagination.totalMaterials);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError(`Failed to load materials: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available subjects, semesters, and tags
  const fetchFilters = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getApiUrl('/api/studyhub/stats'), {
        headers: {
          'x-auth-token': token
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubjects(data.popularSubjects.map(subject => subject._id));
        setAllTags(data.popularTags.map(tag => tag._id));
        
        // Extract unique semesters from materials
        const uniqueSemesters = [...new Set(materials.map(material => material.semester))];
        setSemesters(uniqueSemesters);
      }
    } catch (err) {
      console.error('Error fetching filters:', err);
    }
  };

  // Vote for material
  const handleVote = async (materialId, voteType) => {
    try {
      const response = await fetch(getApiUrl(`/api/studyhub/materials/${materialId}/vote`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ voteType })
      });

      if (response.ok) {
        const data = await response.json();
        // Update the material in the list with the new vote count and user vote state
        setMaterials(prevMaterials => 
          prevMaterials.map(material => 
            material._id === materialId 
              ? { 
                  ...material, 
                  votes: data.material.votes,
                  userVote: data.userVote 
                }
              : material
          )
        );
      }
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  // Download material
  const handleDownload = (material) => {
    if (material.fileURL.startsWith('http')) {
      window.open(material.fileURL, '_blank');
    } else {
              window.open(getApiUrl(`/api/studyhub${material.fileURL}`), '_blank');
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
    fetchMaterials();
  }, [currentPage, search, selectedSubject, selectedSemester, selectedTags]);

  useEffect(() => {
    if (materials.length > 0) {
      fetchFilters();
    }
  }, [materials]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedSubject('');
    setSelectedSemester('');
    setSelectedTags([]);
    setCurrentPage(1);
  };

  // Show loading state
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

  // Show error state
  if (error && materials.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
          <Alert severity="error" sx={{ mb: 2, maxWidth: 600 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={fetchMaterials}>
            Retry
          </Button>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        background: 'var(--cb-bg, #F1F5F9)', 
        width: '100%'
      }}
    >
      <Header />
      <Box sx={{ flex: 1, py: 4, width: '100%' }}>
        <Box sx={{ width: '100%', px: 2 }}>
          <Typography variant="h5" fontWeight={700} color="#2563EB" mb={2}>
            Browse Study Materials ({totalMaterials} materials)
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Search and Filters */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', p: 3, background: '#fff', borderRadius: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Search by title or subject..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ flex: 1, minWidth: 200, background: '#fff', borderRadius: 2 }}
            />
            <FormControl sx={{ minWidth: 120, background: '#fff' }}>
              <InputLabel>Subject</InputLabel>
              <Select
                value={selectedSubject}
                label="Subject"
                onChange={e => setSelectedSubject(e.target.value)}
              >
                <MenuItem value="">All Subjects</MenuItem>
                {subjects.map(subject => (
                  <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120, background: '#fff' }}>
              <InputLabel>Semester</InputLabel>
              <Select
                value={selectedSemester}
                label="Semester"
                onChange={e => setSelectedSemester(e.target.value)}
              >
                <MenuItem value="">All Semesters</MenuItem>
                {semesters.map(semester => (
                  <MenuItem key={semester} value={semester}>{semester}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button 
              variant="outlined" 
              onClick={clearFilters}
              sx={{ px: 3 }}
            >
              Clear Filters
            </Button>
          </Box>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              {allTags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  color={selectedTags.includes(tag) ? 'primary' : 'default'}
                  onClick={() => handleTagToggle(tag)}
                  sx={{ fontWeight: 600, cursor: 'pointer' }}
                />
              ))}
            </Box>
          )}

          {/* Materials Grid */}
          <Grid container spacing={3} justifyContent="center" sx={{ width: '100%' }}>
            {materials.map((material) => {
              const fileType = getFileType(material.fileURL);
              const fileColor = getFileColor(fileType);
              
              return (
                <Grid item key={material._id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card sx={{ 
                    width: 280,
                    height: 320,
                    p: 3, 
                    borderRadius: 4, 
                    boxShadow: 4, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    background: '#fff', 
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Avatar sx={{ bgcolor: fileColor, width: 32, height: 32, fontWeight: 700, fontSize: 12 }}>
                        {fileType}
                      </Avatar>
                      <Typography fontWeight={700} color="#2563EB" sx={{ flex: 1, fontSize: '0.9rem', lineHeight: 1.2 }}>
                        {material.title}
                      </Typography>
                    </Box>
                    
                                                              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, mb: 2, minHeight: 80 }}>
                       <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                         <strong>Subject:</strong> {material.subject}
                       </Typography>
                       <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                         <strong>Semester:</strong> {material.semester}
                       </Typography>
                       <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                         <strong>Uploader:</strong> {material.uploadedBy.name}
                       </Typography>
                       <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                         <strong>Votes:</strong> {material.votes}
                       </Typography>
                     </Box>
                     
                     <Box sx={{ mt: 'auto', minHeight: 60 }}>
                       <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2, minHeight: 32 }}>
                         {material.tags.length > 0 ? (
                           <>
                             {material.tags.slice(0, 3).map(tag => (
                               <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#DBEAFE', color: '#2563EB', fontWeight: 600 }} />
                             ))}
                             {material.tags.length > 3 && (
                               <Chip label={`+${material.tags.length - 3}`} size="small" sx={{ bgcolor: '#F3F4F6', color: '#6B7280' }} />
                             )}
                           </>
                         ) : (
                           <Box sx={{ height: 32 }}></Box>
                         )}
                       </Box>
                       
                       <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownload(material)}
                          sx={{ flex: 1, fontWeight: 600, borderRadius: 2 }}
                        >
                          Download
                        </Button>
                        <IconButton 
                          onClick={() => handleVote(material._id, 'up')}
                          sx={{ 
                            color: material.userVote === 'up' ? '#fff' : '#059669',
                            bgcolor: material.userVote === 'up' ? '#059669' : 'transparent',
                            '&:hover': {
                              bgcolor: material.userVote === 'up' ? '#047857' : '#f0fdf4'
                            }
                          }}
                        >
                          <ThumbUpIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleVote(material._id, 'down')}
                          sx={{ 
                            color: material.userVote === 'down' ? '#fff' : '#DC2626',
                            bgcolor: material.userVote === 'down' ? '#DC2626' : 'transparent',
                            '&:hover': {
                              bgcolor: material.userVote === 'down' ? '#B91C1C' : '#fef2f2'
                            }
                          }}
                        >
                          <ThumbDownIcon />
                        </IconButton>
                      </Box>
                     </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}

          {materials.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No materials found. Try adjusting your search or filters.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
} 