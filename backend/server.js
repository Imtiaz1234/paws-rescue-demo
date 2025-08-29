require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
connectDB();
const adminRoutes = require('./routes/admin');
const allowedOrigins = ['http://localhost:3000'];

app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
/*
app.use(cors({
  origin: function(origin, callback){
    // Allow requests with no origin (like curl or postman)
    if(!origin) return callback(null, true);

    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  },
  credentials: true
}));*/

app.use(express.json({ limit: '10mb' }));

// Middleware to add CORS headers on images
app.use('/images', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigins.join(','));
  next();
});

// Serve static images folder
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.get('/', (req, res) => res.send('PawsRescue API running'));

// Route mounting (no duplicate mounting of admin routes)
app.use('/api/cats', require('./routes/cats'));
app.use('/api/admin', adminRoutes);
app.use('/api/adoption', require('./routes/adoption'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donations', require('./routes/donations'));
//app.use('/api/rescues', require('./routes/rescue'));
app.use('/api/user', require('./routes/user'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/user', require('./routes/userFavorites'));
//app.use('/api/admin', require('./routes/admin'));
app.use('/api/rescue', require('./routes/rescue'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
