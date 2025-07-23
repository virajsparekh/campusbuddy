const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['item', 'accommodation'],
    required: true
  },
  price: {
    type: Number,
    required: function() {
      return this.type === 'item';
    }
  },
  rent: {
    type: Number,
    required: function() {
      return this.type === 'accommodation';
    }
  },
  category: {
    type: String,
    required: function() {
      return this.type === 'item';
    }
  },
  location: {
    type: String,
    required: function() {
      return this.type === 'item';
    }
  },
  address: {
    type: String,
    required: function() {
      return this.type === 'accommodation';
    }
  },
  amenities: [{
    type: String
  }],
  image: {
    type: String, // Will store base64 image or URL
    default: ''
  },
  priority: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
listingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Listing', listingSchema);
