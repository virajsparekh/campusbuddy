const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorization');
const User = require('../models/User');
const Event = require('../models/Event');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/events');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('image'); 

router.get('/dashboard', auth, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ isPremium: true });
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const totalEvents = await Event.countDocuments();
    const premiumEvents = await Event.countDocuments({ isPremiumOnly: true });

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role isPremium isBlocked createdAt');

    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title date location isPremiumOnly createdAt');

    res.json({
      stats: {
        totalUsers,
        premiumUsers,
        blockedUsers,
        totalEvents,
        premiumEvents,
        activeUsers: totalUsers - blockedUsers
      },
      recentUsers,
      recentEvents
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all users with pagination and filtering
router.get('/users', auth, requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      role, 
      isPremium, 
      isBlocked,
      college 
    } = req.query;

    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Role filter
    if (role) query.role = role;
    
    // Premium filter
    if (isPremium !== undefined) query.isPremium = isPremium === 'true';
    
    // Blocked filter
    if (isBlocked !== undefined) query.isBlocked = isBlocked === 'true';
    
    // College filter
    if (college) {
      query['college.name'] = { $regex: college, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user by ID
router.get('/users/:id', auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update user 
router.put('/users/:id', auth, requireAdmin, async (req, res) => {
  try {
    
    const { name, isBlocked, role, isPremium, premiumExpiry, college } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (isBlocked !== undefined) updateData.isBlocked = isBlocked;
    if (role) updateData.role = role;
    if (isPremium !== undefined) updateData.isPremium = isPremium;
    if (premiumExpiry) updateData.premiumExpiry = premiumExpiry;
    if (college) updateData.college = college;
    
    
    // First check if user exists
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Update the user
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    
    res.json({ msg: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Block user
router.patch('/users/:id/block', auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json({ msg: 'User blocked successfully', user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Unblock user
router.patch('/users/:id/unblock', auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json({ msg: 'User unblocked successfully', user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all events with pagination and filtering
router.get('/events', auth, requireAdmin, async (req, res) => {
  try {
    
    const { 
      page = 1, 
      limit = 10, 
      search, 
      isPremiumOnly,
      dateFrom,
      dateTo
    } = req.query;

    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Premium filter
    if (isPremiumOnly !== undefined) query.isPremiumOnly = isPremiumOnly === 'true';
    
    // Date range filter
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }


    const skip = (page - 1) * limit;
    
    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);
    const totalPages = Math.ceil(total / limit);


    res.json({
      events,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalEvents: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

// Get event by ID
router.get('/events/:id', auth, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create new event
router.post('/events', auth, requireAdmin, (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ msg: 'File upload error: ' + err.message });
    } else if (err) {
      // An unknown error occurred
      return res.status(400).json({ msg: 'File upload error: ' + err.message });
    }

    try {
      const { 
        eventId, 
        title, 
        description, 
        date, 
        time, 
        location, 
        category,
        isPremiumOnly 
      } = req.body;
      
      const eventDateTime = new Date(`${date}T${time}`);
      
      // Handle image upload
      let imageUrl = '';
      if (req.file) {
        // Create URL for the uploaded image
        imageUrl = `/uploads/events/${req.file.filename}`;
      }
      
      const newEvent = new Event({
        eventId: eventId || `E${Date.now()}`,
        title,
        description,
        imageUrl,
        date: eventDateTime,
        location,
        isPremiumOnly: isPremiumOnly === 'true' || isPremiumOnly === true,
        createdBy: {
          userId: req.user.userId || req.user._id,
          name: req.user.name,
          email: req.user.email
        }
      });
      
      const event = await newEvent.save();
      await event.populate('createdBy', 'name email');
      
      res.json({ msg: 'Event created successfully', event });
    } catch (err) {
      res.status(500).json({ msg: 'Server error: ' + err.message });
    }
  });
});

// Update event
router.put('/events/:id', auth, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('createdBy', 'name email');
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json({ msg: 'Event updated successfully', event });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete event
router.delete('/events/:id', auth, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json({ msg: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get system statistics
router.get('/stats', auth, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ isPremium: true });
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const studentUsers = await User.countDocuments({ role: 'student' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    const totalEvents = await Event.countDocuments();
    const premiumEvents = await Event.countDocuments({ isPremiumOnly: true });
    const upcomingEvents = await Event.countDocuments({ 
      date: { $gte: new Date() } 
    });

    // Get users by college
    const usersByCollege = await User.aggregate([
      { $group: { _id: '$college.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email role isPremium isBlocked createdAt');

    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title date location isPremiumOnly createdAt');

    res.json({
      userStats: {
        total: totalUsers,
        premium: premiumUsers,
        blocked: blockedUsers,
        students: studentUsers,
        admins: adminUsers,
        active: totalUsers - blockedUsers
      },
      eventStats: {
        total: totalEvents,
        premium: premiumEvents,
        upcoming: upcomingEvents
      },
      usersByCollege,
      recentActivity: {
        users: recentUsers,
        events: recentEvents
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Serve uploaded images
router.get('/uploads/events/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads/events', filename);
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ msg: 'Image not found' });
  }
});

module.exports = router; 