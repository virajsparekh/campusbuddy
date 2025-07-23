const mongoose = require('mongoose');

const AnsweredBySchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String
}, { _id: false });

const AnswerSchema = new mongoose.Schema({
  answerId: { type: String, required: true, unique: true },
  questionId: { type: String, required: true },
  answerText: String,
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  answeredBy: { type: AnsweredBySchema, required: true }
});

module.exports = mongoose.model('Answer', AnswerSchema); 