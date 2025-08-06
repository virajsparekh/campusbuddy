const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  answerId: {
    type: String,
    required: true,
    unique: true
  },
  questionId: {
    type: String,
    required: true
  },
  questionObjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  answerText: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  answeredBy: {
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
  isAccepted: {
    type: Boolean,
    default: false
  },
  userVotes: [{
    userId: String,
    voteType: {
      type: String,
      enum: ['up', 'down']
    }
  }]
});

module.exports = mongoose.model('Answer', AnswerSchema, 'answers'); 