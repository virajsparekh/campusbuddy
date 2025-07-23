const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const qaRoutes = require('./routes/qa');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const eventsRoutes = require('./routes/events');

console.log('Loading marketplace routes...');
const marketplaceRoutes = require('./routes/marketplace');
console.log('Marketplace routes loaded successfully');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for large image uploads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/marketplace', marketplaceRoutes);

console.log('Routes registered:');
console.log('- /api/auth');
console.log('- /api/qa');
console.log('- /api/admin');
console.log('- /api/user');
console.log('- /api/events');
console.log('- /api/marketplace');

// Test root route
app.get('/', (req, res) => {
  res.json({ message: 'CampusBuddy API is running!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 