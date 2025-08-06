const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { requireNotBlocked } = require('../middleware/authorization');
const Material = require('../models/Material');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/materials');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'material-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept common document and media files
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
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only documents, images, videos, and audio files are allowed.'), false);
    }
  }
});

// Get all materials with pagination and filtering
router.get('/materials', auth, requireNotBlocked, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      subject,
      semester,
      tags,
      sortBy = 'uploadDate',
      sortOrder = 'desc'
    } = req.query;

    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Subject filter
    if (subject) {
      query.subject = { $regex: subject, $options: 'i' };
    }
    
    // Semester filter
    if (semester) {
      query.semester = { $regex: semester, $options: 'i' };
    }
    
    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const materials = await Material.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Material.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Add user vote information to each material
    const userId = req.user.userId || req.user._id;
    const materialsWithUserVotes = materials.map(material => {
      const materialObj = material.toObject();
      const userVote = material.userVotes.find(vote => vote.userId === userId);
      materialObj.userVote = userVote ? userVote.voteType : null;
      return materialObj;
    });

    res.json({
      materials: materialsWithUserVotes,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalMaterials: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get materials uploaded by current user
router.get('/materials/my-uploads', auth, requireNotBlocked, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      sortBy = 'uploadDate',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const query = { 'uploadedBy.userId': req.user.userId || req.user._id };
    
    const materials = await Material.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Material.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Add user vote information to each material
    const userId = req.user.userId || req.user._id;
    const materialsWithUserVotes = materials.map(material => {
      const materialObj = material.toObject();
      const userVote = material.userVotes.find(vote => vote.userId === userId);
      materialObj.userVote = userVote ? userVote.voteType : null;
      return materialObj;
    });

    res.json({
      materials: materialsWithUserVotes,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalMaterials: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get material by ID
router.get('/materials/:id', auth, requireNotBlocked, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }
    
    // Add user vote information
    const userId = req.user.userId || req.user._id;
    const materialObj = material.toObject();
    const userVote = material.userVotes.find(vote => vote.userId === userId);
    materialObj.userVote = userVote ? userVote.voteType : null;
    
    res.json(materialObj);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Upload new material
router.post('/materials', auth, requireNotBlocked, upload.single('file'), async (req, res) => {
  try {
    const { title, subject, semester, tags } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    
    const fileURL = `/uploads/materials/${req.file.filename}`;
    
    const newMaterial = new Material({
      materialId: `M${Date.now()}`,
      title,
      subject,
      semester,
      fileURL,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      uploadedBy: {
        userId: req.user.userId || req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    });
    
    const material = await newMaterial.save();
    res.json({ msg: 'Material uploaded successfully', material });
  } catch (err) {
    if (err.message.includes('Invalid file type')) {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update material
router.put('/materials/:id', auth, requireNotBlocked, async (req, res) => {
  try {
    const { title, subject, semester, tags } = req.body;
    
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }
    
    // Check if user is the author
    if (material.uploadedBy.userId !== (req.user.userId || req.user._id)) {
      return res.status(403).json({ msg: 'Not authorized to update this material' });
    }
    
    const updatedMaterial = await Material.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        subject, 
        semester, 
        tags: tags ? tags.split(',').map(tag => tag.trim()) : []
      },
      { new: true }
    );
    
    res.json({ msg: 'Material updated successfully', material: updatedMaterial });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete material
router.delete('/materials/:id', auth, requireNotBlocked, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }
    
    // Check if user is the author
    if (material.uploadedBy.userId !== (req.user.userId || req.user._id)) {
      return res.status(403).json({ msg: 'Not authorized to delete this material' });
    }
    
    // Delete the file from server
    if (material.fileURL && material.fileURL.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', material.fileURL);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Material.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Material deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Vote for material
router.post('/materials/:id/vote', auth, requireNotBlocked, async (req, res) => {
  try {
    const { voteType } = req.body; // 'up' or 'down'
    const userId = req.user.userId || req.user._id;
    
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }
    
    // Check if user has already voted
    const existingVoteIndex = material.userVotes.findIndex(vote => vote.userId === userId);
    
    if (existingVoteIndex !== -1) {
      // User has already voted
      const existingVote = material.userVotes[existingVoteIndex];
      
      if (existingVote.voteType === voteType) {
        // Same vote type - remove the vote
        const voteChange = existingVote.voteType === 'up' ? -1 : 1;
        material.votes += voteChange;
        material.userVotes.splice(existingVoteIndex, 1);
      } else {
        // Different vote type - change the vote
        const voteChange = voteType === 'up' ? 2 : -2; // +2 for upvote change, -2 for downvote change
        material.votes += voteChange;
        material.userVotes[existingVoteIndex].voteType = voteType;
        material.userVotes[existingVoteIndex].votedAt = new Date();
      }
    } else {
      // User hasn't voted before - add new vote
      const voteChange = voteType === 'up' ? 1 : -1;
      material.votes += voteChange;
      material.userVotes.push({
        userId: userId,
        voteType: voteType,
        votedAt: new Date()
      });
    }
    
    await material.save();
    res.json({ 
      msg: 'Vote recorded successfully', 
      material,
      userVote: material.userVotes.find(vote => vote.userId === userId)?.voteType || null
    });
  } catch (err) {
    console.error('Vote error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Serve uploaded material files
router.get('/uploads/materials/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads/materials', filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ msg: 'File not found' });
  }
});

// Get study hub statistics
router.get('/stats', auth, requireNotBlocked, async (req, res) => {
  try {
    const totalMaterials = await Material.countDocuments();
    const userMaterials = await Material.countDocuments({ 
      'uploadedBy.userId': req.user.userId || req.user._id 
    });
    
    // Get recent materials
    const recentMaterials = await Material.find()
      .sort({ uploadDate: -1 })
      .limit(5)
      .select('title subject uploadDate uploadedBy.name votes');
    
    // Get popular subjects
    const popularSubjects = await Material.aggregate([
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get popular tags
    const popularTags = await Material.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      stats: {
        totalMaterials,
        userMaterials,
        averageVotesPerMaterial: totalMaterials > 0 ? 
          (await Material.aggregate([{ $group: { _id: null, avg: { $avg: '$votes' } } }]))[0]?.avg || 0 : 0
      },
      recentMaterials,
      popularSubjects,
      popularTags
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 