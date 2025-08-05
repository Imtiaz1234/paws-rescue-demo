const User = require('../models/User');
const { validationResult } = require('express-validator');

// Helper function for error responses
const sendError = (res, status, message, details = null) => {
  console.error(`[ERROR] ${new Date().toISOString()}`, { status, message, details });
  res.status(status).json({
    error: {
      message,
      timestamp: new Date(),
      ...(details && { details })
    }
  });
};

exports.registerUser = async (req, res) => {
  try {
    console.log('[REGISTER] Start - Body:', req.body);

    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, 'Validation failed', { errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email }).maxTimeMS(3000);
    if (existingUser) {
      return sendError(res, 400, 'Email already exists');
    }

    // Create and save user
    console.log('[REGISTER] Creating user...');
    const user = new User({ name, email, password });
    await user.save({ maxTimeMS: 5000 });

    console.log('[REGISTER] Success - User:', user);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });

  } catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      sendError(res, 400, 'Email already exists (MongoDB duplicate key)');
    } else if (err.name === 'MongoNetworkError') {
      sendError(res, 503, 'Database service unavailable');
    } else {
      sendError(res, 500, 'Registration failed', {
        errorType: err.name,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  }
};

exports.loginUser = async (req, res) => {
  try {
    console.log('[LOGIN] Attempt - Body:', req.body);
    
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return sendError(res, 400, 'Email and password required');
    }

    // Find user with timeout
    const user = await User.findOne({ email }).maxTimeMS(3000);
    if (!user) {
      return sendError(res, 401, 'Invalid credentials');
    }

    // Password comparison (mock - replace with bcrypt in production)
    if (password !== '123456') { // Temporary for testing
      return sendError(res, 401, 'Invalid credentials');
    }

    console.log('[LOGIN] Success - User ID:', user._id);
    res.json({
      token: 'mock.jwt.token', // Replace with real JWT
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    sendError(res, 500, 'Login failed', {
      errorType: err.name,
      databaseStatus: mongoose.connection.readyState
    });
  }
};

// Add this if using express-validator in routes
exports.validate = (method) => {
  switch (method) {
    case 'register': {
      return [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 })
      ]
    }
  }
};

exports.checkEmailExists = async (email) => {
  try {
    return await User.findOne({ email }).maxTimeMS(3000);
  } catch (err) {
    console.error('Email check error:', err);
    throw err;
  }
};