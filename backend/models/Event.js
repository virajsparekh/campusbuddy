const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  isPremiumOnly: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  }
});

module.exports = mongoose.model('Event', EventSchema); 