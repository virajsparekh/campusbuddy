const mongoose = require('mongoose');

const CollegeSchema = new mongoose.Schema({
  name: String,
  province: String,
  type: String,
  _id: mongoose.Schema.Types.ObjectId
}, { _id: false });

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  studentId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  isPremium: { type: Boolean, default: false },
  premiumExpiry: { type: Date, default: null },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  college: { type: CollegeSchema, default: null },
  refreshTokens: [String]
});

module.exports = mongoose.model('User', UserSchema); 