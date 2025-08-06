const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Event schema
const eventSchema = new mongoose.Schema({
  eventId: String,
  title: String,
  description: String,
  date: Date,
  location: String,
  isPremiumOnly: Boolean,
  createdAt: Date,
  createdBy: {
    userId: String,
    name: String,
    email: String
  },
  imageUrl: String
}, { strict: false });

// Create model with explicit collection name
const Event = mongoose.model('events', eventSchema, 'events');

// Test endpoint to check database collections
router.get('/debug', auth, async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // Count documents in events collection
    const eventsCount = await mongoose.connection.db.collection('events').countDocuments();
    
    // Get sample documents
    const sampleEvent = await mongoose.connection.db.collection('events').findOne();
    
    res.json({
      collections: collectionNames,
      counts: {
        events: eventsCount
      },
      samples: {
        event: sampleEvent
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all events
router.get('/', auth, async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12, premiumOnly = false } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (premiumOnly === 'true') {
      query.isPremiumOnly = true;
    }
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex }
      ];
    }

    // Fetch events using raw MongoDB
    const events = await mongoose.connection.db.collection('events')
      .find(query)
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    // Get total count
    const totalEvents = await mongoose.connection.db.collection('events').countDocuments(query);

    res.json({
      events: events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalEvents / limit),
        totalItems: totalEvents,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single event by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Convert string ID to ObjectId
    const ObjectId = require('mongodb').ObjectId;
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    const event = await mongoose.connection.db.collection('events')
      .findOne({ _id: objectId });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's events
router.get('/my-events', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Fetch user's events using raw MongoDB
    const events = await mongoose.connection.db.collection('events')
      .find({ 'createdBy.userId': userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    // Get total count
    const totalEvents = await mongoose.connection.db.collection('events').countDocuments({ 'createdBy.userId': userId });

    res.json({
      events: events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalEvents / limit),
        totalItems: totalEvents,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new event
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { title, description, date, location, isPremiumOnly, imageUrl } = req.body;

    const newEvent = {
      eventId: `E${Date.now()}`,
      title,
      description,
      date: new Date(date),
      location,
      isPremiumOnly: isPremiumOnly || false,
      createdAt: new Date(),
      createdBy: {
        userId,
        name: req.user.name,
        email: req.user.email
      },
      imageUrl: imageUrl || ''
    };

    // Use raw MongoDB to ensure correct collection name
    const result = await mongoose.connection.db.collection('events').insertOne(newEvent);
    newEvent._id = result.insertedId;

    res.status(201).json({ 
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event
router.put('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { id } = req.params;
    const { title, description, date, location, isPremiumOnly, imageUrl } = req.body;


    // Convert string ID to ObjectId
    const ObjectId = require('mongodb').ObjectId;
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    // Update event using raw MongoDB
    const result = await mongoose.connection.db.collection('events').updateOne(
      { _id: objectId, 'createdBy.userId': userId },
      {
        $set: {
          title,
          description,
          date: new Date(date),
          location,
          isPremiumOnly: isPremiumOnly || false,
          imageUrl: imageUrl || '',
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { id } = req.params;

    // Convert string ID to ObjectId
    const ObjectId = require('mongodb').ObjectId;
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    // Delete event using raw MongoDB
    const result = await mongoose.connection.db.collection('events').deleteOne({ 
      _id: objectId, 
      'createdBy.userId': userId 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 