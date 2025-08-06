const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  askedBy: {
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
  },
  // Optional fields for enhanced functionality
  views: {
    type: Number,
    default: 0
  },
  votes: {
    type: Number,
    default: 0
  },
  answers: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Open', 'Answered', 'Closed'],
    default: 'Open'
  },
  userVotes: [{
    userId: String,
    voteType: {
      type: String,
      enum: ['up', 'down']
    }
  }]
});

module.exports = mongoose.model('Question', QuestionSchema, 'questions'); 