const mongoose = require('mongoose');

const AskedBySchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
  questionId: { type: String, required: true, unique: true },
  title: String,
  description: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  askedBy: { type: AskedBySchema, required: true }
});

module.exports = mongoose.model('Question', QuestionSchema); 