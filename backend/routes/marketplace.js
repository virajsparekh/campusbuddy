const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Marketplace routes are working!' });
});

// Get all listings
router.get('/listings', async (req, res) => {
  try {
    const { type, category, search } = req.query;
    let filter = { isActive: true };

    if (type && type !== 'All') {
      filter.type = type.toLowerCase();
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const listings = await Listing.find(filter)
      .populate('userId', 'name email')
      .sort({ priority: -1, createdAt: -1 });

    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get listings by user
router.get('/my-listings', auth, async (req, res) => {
  try {
    const listings = await Listing.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new listing
router.post('/listings', auth, async (req, res) => {
  try {
    console.log('Received listing request, body size:', JSON.stringify(req.body).length);
    
    const {
      title,
      description,
      type,
      price,
      rent,
      category,
      location,
      address,
      amenities,
      image,
      priority
    } = req.body;

    // Validate required fields based on type
    if (!title || !description || !type) {
      return res.status(400).json({ message: 'Title, description, and type are required' });
    }

    if (type === 'item' && (!price || !category || !location)) {
      return res.status(400).json({ message: 'Price, category, and location are required for items' });
    }

    if (type === 'accommodation' && (!rent || !address)) {
      return res.status(400).json({ message: 'Rent and address are required for accommodations' });
    }

    const listingData = {
      userId: req.user.id,
      title,
      description,
      type,
      image: image || '',
      priority: priority || false
    };

    if (type === 'item') {
      listingData.price = price;
      listingData.category = category;
      listingData.location = location;
    } else if (type === 'accommodation') {
      listingData.rent = rent;
      listingData.address = address;
      listingData.amenities = amenities || [];
    }

    const listing = new Listing(listingData);
    await listing.save();

    // Populate user info before sending response
    await listing.populate('userId', 'name email');

    res.status(201).json(listing);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a listing
router.put('/listings/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user owns the listing
    if (listing.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('userId', 'name email');

    res.json(updatedListing);
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a listing
router.delete('/listings/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user owns the listing
    if (listing.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single listing
router.get('/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('userId', 'name email');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
