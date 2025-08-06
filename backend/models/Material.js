const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  materialId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  fileURL: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  uploadDate: {
    type: Date,
    default: Date.now
  },
  votes: {
    type: Number,
    default: 0
  },
  userVotes: [{
    userId: {
      type: String,
      required: true
    },
    voteType: {
      type: String,
      enum: ['up', 'down'],
      required: true
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  uploadedBy: {
    userId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  }
});

module.exports = mongoose.model('Material', MaterialSchema); 