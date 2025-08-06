const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Define schemas for the collections
const accommodationSchema = new mongoose.Schema({
  accommodationId: String,
  location: String,
  rent: Number,
  details: String,
  contactInfo: String,
  imageUrl: String,
  isPriority: Boolean,
  createdAt: Date,
  postedBy: {
    userId: String,
    name: String,
    email: String
  }
}, { strict: false });

const marketplaceSchema = new mongoose.Schema({
  marketplaceId: String,
  title: String,
  description: String,
  price: Number,
  category: String,
  condition: String,
  contactInfo: String,
  imageUrl: String,
  isPriority: Boolean,
  createdAt: Date,
  postedBy: {
    userId: String,
    name: String,
    email: String
  }
}, { strict: false }); 

// Create models with explicit collection names
const Accommodation = mongoose.model('accommodations', accommodationSchema, 'accommodations'); 
const Marketplace = mongoose.model('marketplace', marketplaceSchema, 'marketplace');

// Get single listing by ID
router.get('/listings/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Convert string ID to ObjectId
    const ObjectId = require('mongodb').ObjectId;
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid listing ID format' });
    }
    
    let listing = await mongoose.connection.db.collection('marketplace')
      .findOne({ _id: objectId });
    
    if (listing) {
    } else {
    }

    if (listing) {
      // Transform marketplace item
      const transformedListing = {
        _id: listing._id,
        type: 'marketplace',
        title: listing.title,
        description: listing.description,
        price: listing.price,
        priceUnit: '',
        category: listing.category,
        condition: listing.condition,
        location: 'Near Campus',
        contactInfo: listing.contactInfo,
        isPriority: listing.isPriority,
        createdAt: listing.createdAt,
        postedBy: listing.postedBy,
        img: listing.imageUrl || getCategoryImage(listing.category)
      };

      return res.json({ listing: transformedListing });
    }

    // If not found in marketplace, try accommodations
    listing = await mongoose.connection.db.collection('accommodations')
      .findOne({ _id: objectId });
    

    if (listing) {
      // Transform accommodation
      const transformedListing = {
        _id: listing._id,
        type: 'accommodation',
        title: `Accommodation - ${listing.accommodationId}`,
        description: listing.details,
        price: listing.rent,
        priceUnit: '/mo',
        category: 'Accommodation',
        condition: 'Available',
        location: listing.location,
        contactInfo: listing.contactInfo,
        isPriority: listing.isPriority,
        createdAt: listing.createdAt,
        postedBy: listing.postedBy,
        img: listing.imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
      };

      return res.json({ listing: transformedListing });
    }

    // If not found in either collection
    return res.status(404).json({ message: 'Listing not found' });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all listings (both marketplace and accommodations)
router.get('/listings', auth, async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    // Fetch marketplace items
    let marketplaceQuery = {};
    if (category && category !== 'All' && category !== 'Accommodation') {
      marketplaceQuery.category = category;
    }
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      marketplaceQuery.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    // Use raw MongoDB access for marketplace since Mongoose seems to have issues
    const marketplaceItems = await mongoose.connection.db.collection('marketplace')
      .find(marketplaceQuery)
      .sort({ isPriority: -1, createdAt: -1 })
      .toArray();


    // Fetch accommodations
    let accommodationQuery = {};
    if (category === 'Accommodation') {
    } else if (category && category !== 'All') {
      accommodationQuery = { _id: null }; 
    } else {
      accommodationQuery = {};
    }
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      if (accommodationQuery.$or) {
        accommodationQuery.$or.push(
          { location: searchRegex },
          { details: searchRegex }
        );
      } else {
        accommodationQuery.$or = [
          { location: searchRegex },
          { details: searchRegex }
        ];
      }
    }

    const accommodations = await mongoose.connection.db.collection('accommodations')
      .find(accommodationQuery)
      .sort({ isPriority: -1, createdAt: -1 })
      .toArray();

    const transformedAccommodations = accommodations.map(acc => ({
      _id: acc._id,
      type: 'accommodation',
      title: `Accommodation - ${acc.accommodationId}`,
      description: acc.details,
      price: acc.rent,
      priceUnit: '/mo',
      category: 'Accommodation',
      condition: 'Available',
      location: acc.location,
      contactInfo: acc.contactInfo,
      isPriority: acc.isPriority,
      createdAt: acc.createdAt,
      postedBy: acc.postedBy,
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
    }));

    // Transform marketplace items
    const transformedMarketplace = marketplaceItems.map(item => ({
      _id: item._id,
      type: 'marketplace',
      title: item.title,
      description: item.description,
      price: item.price,
      priceUnit: '',
      category: item.category,
      condition: item.condition,
      location: 'Near Campus',
      contactInfo: item.contactInfo,
      isPriority: item.isPriority,
      createdAt: item.createdAt,
      postedBy: item.postedBy,
      img: item.imageUrl || getCategoryImage(item.category)
    }));

    // Combine and sort by priority and date
    const allListings = [...transformedAccommodations, ...transformedMarketplace]
      .sort((a, b) => {
        if (a.isPriority !== b.isPriority) {
          return b.isPriority ? 1 : -1;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    // Apply pagination to combined results
    const paginatedListings = allListings.slice(skip, skip + parseInt(limit));

    // Get total counts for pagination using raw MongoDB
    const totalMarketplace = await mongoose.connection.db.collection('marketplace').countDocuments(marketplaceQuery);
    const totalAccommodations = await mongoose.connection.db.collection('accommodations').countDocuments(accommodationQuery);
    const totalItems = totalMarketplace + totalAccommodations;


    res.json({
      listings: paginatedListings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's listings
router.get('/my-listings', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Fetch user's marketplace items using raw MongoDB
    const marketplaceItems = await mongoose.connection.db.collection('marketplace')
      .find({ 'postedBy.userId': userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    // Fetch user's accommodations using raw MongoDB
    const accommodations = await mongoose.connection.db.collection('accommodations')
      .find({ 'postedBy.userId': userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    // Transform accommodations
    const transformedAccommodations = accommodations.map(acc => ({
      _id: acc._id,
      type: 'accommodation',
      title: `Accommodation - ${acc.accommodationId}`,
      description: acc.details,
      price: acc.rent,
      priceUnit: '/mo',
      category: 'Accommodation',
      condition: 'Available',
      location: acc.location,
      contactInfo: acc.contactInfo,
      isPriority: acc.isPriority,
      createdAt: acc.createdAt,
      postedBy: acc.postedBy,
      img: acc.imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
    }));

    // Transform marketplace items
    const transformedMarketplace = marketplaceItems.map(item => ({
      _id: item._id,
      type: 'marketplace',
      title: item.title,
      description: item.description,
      price: item.price,
      priceUnit: '',
      category: item.category,
      condition: item.condition,
      location: 'Near Campus',
      contactInfo: item.contactInfo,
      isPriority: item.isPriority,
      createdAt: item.createdAt,
      postedBy: item.postedBy,
      img: getCategoryImage(item.category)
    }));

    const allListings = [...transformedAccommodations, ...transformedMarketplace]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get total counts using raw MongoDB
    const totalMarketplace = await mongoose.connection.db.collection('marketplace').countDocuments({ 'postedBy.userId': userId });
    const totalAccommodations = await mongoose.connection.db.collection('accommodations').countDocuments({ 'postedBy.userId': userId });
    const totalItems = totalMarketplace + totalAccommodations;

    res.json({
      listings: allListings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new marketplace listing
router.post('/listings', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { title, description, price, category, condition, contactInfo, imageUrl } = req.body;

    const newListing = {
      marketplaceId: `MP${Date.now()}`,
      title,
      description,
      price: parseFloat(price),
      category,
      condition,
      contactInfo,
      imageUrl: imageUrl || getCategoryImage(category), 
      isPriority: false,
      createdAt: new Date(),
      postedBy: {
        userId,
        name: req.user.name,
        email: req.user.email
      }
    };

    // Use raw MongoDB to ensure correct collection name
    const result = await mongoose.connection.db.collection('marketplace').insertOne(newListing);
    newListing._id = result.insertedId;

    res.status(201).json({ 
      message: 'Listing created successfully',
      listing: newListing
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new accommodation listing
router.post('/accommodations', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { location, rent, details, contactInfo, imageUrl } = req.body;

    const newAccommodation = {
      accommodationId: `Acm${Date.now()}`,
      location,
      rent: parseFloat(rent),
      details,
      contactInfo,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', 
      isPriority: false,
      createdAt: new Date(),
      postedBy: {
        userId,
        name: req.user.name,
        email: req.user.email
      }
    };

    // Use raw MongoDB to ensure correct collection name
    const result = await mongoose.connection.db.collection('accommodations').insertOne(newAccommodation);
    newAccommodation._id = result.insertedId;

    res.status(201).json({ 
      message: 'Accommodation listing created successfully',
      accommodation: newAccommodation
    });
  } catch (error) {
    console.error('Error creating accommodation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update marketplace listing
router.put('/listings/:id', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { id } = req.params;
    const { title, description, price, category, condition, contactInfo, imageUrl } = req.body;

    // Convert string ID to ObjectId
    const ObjectId = require('mongodb').ObjectId;
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid listing ID format' });
    }

    // Update marketplace listing using raw MongoDB
    const result = await mongoose.connection.db.collection('marketplace').updateOne(
      { _id: objectId, 'postedBy.userId': userId },
      {
        $set: {
          title,
          description,
          price: parseFloat(price),
          category,
          condition,
          contactInfo,
          imageUrl: imageUrl || getCategoryImage(category),
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Listing not found or unauthorized' });
    }

    res.json({ message: 'Listing updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update accommodation listing
router.put('/accommodations/:id', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { id } = req.params;
    const { location, rent, details, contactInfo, imageUrl } = req.body;

    // Convert string ID to ObjectId
    const ObjectId = require('mongodb').ObjectId;
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid listing ID format' });
    }

    // Update accommodation listing using raw MongoDB
    const result = await mongoose.connection.db.collection('accommodations').updateOne(
      { _id: objectId, 'postedBy.userId': userId },
      {
        $set: {
          location,
          rent: parseFloat(rent),
          details,
          contactInfo,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Listing not found or unauthorized' });
    }

    res.json({ message: 'Accommodation updated successfully' });
  } catch (error) {
    console.error('Error updating accommodation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete listing
router.delete('/listings/:id', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { id } = req.params;

    // Convert string ID to ObjectId
    const ObjectId = require('mongodb').ObjectId;
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid listing ID format' });
    }

    // Try to delete from marketplace first using raw MongoDB
    const marketplaceResult = await mongoose.connection.db.collection('marketplace').deleteOne({ 
      _id: objectId, 
      'postedBy.userId': userId 
    });

    let deleted = marketplaceResult.deletedCount > 0;

    if (!deleted) {
      // If not found in marketplace, try accommodations
      const accommodationResult = await mongoose.connection.db.collection('accommodations').deleteOne({ 
        _id: objectId, 
        'postedBy.userId': userId 
      });
      deleted = accommodationResult.deletedCount > 0;
    }

    if (!deleted) {
      return res.status(404).json({ message: 'Listing not found or unauthorized' });
    }

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test endpoint to check database collections
router.get('/debug', auth, async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // Count documents in each collection
    const marketplaceCount = await mongoose.connection.db.collection('marketplace').countDocuments();
    const accommodationsCount = await mongoose.connection.db.collection('accommodations').countDocuments();
    
    // Get sample documents
    const sampleMarketplace = await mongoose.connection.db.collection('marketplace').findOne();
    const sampleAccommodation = await mongoose.connection.db.collection('accommodations').findOne();
    
    res.json({
      collections: collectionNames,
      counts: {
        marketplace: marketplaceCount,
        accommodations: accommodationsCount
      },
      samples: {
        marketplace: sampleMarketplace,
        accommodation: sampleAccommodation
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to get category images
function getCategoryImage(category) {
  const images = {
    'Electronics': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    'Furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
    'Books': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80',
    'Other': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'
  };
  return images[category] || images['Other'];
}

module.exports = router; 