const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body, validationResult } = require('express-validator');

// Enhanced input validation middleware
const validateRegisterInput = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
    
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    
  // Custom validation
  body('email').custom(async (email) => {
    const user = await authController.checkEmailExists(email);
    if (user) {
      throw new Error('Email already in use');
    }
  })
];

// Unified error formatter
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        param: err.param,
        msg: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Enhanced registration route
router.post('/register', 
  validateRegisterInput,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      console.log('[REGISTER] Starting registration for:', req.body.email);
      const startTime = Date.now();
      
      await authController.registerUser(req, res);
      
      console.log(`[REGISTER] Completed in ${Date.now() - startTime}ms`);
    } catch (err) {
      console.error('[REGISTER] Route handler error:', err);
      next(err);
    }
  }
);

// Enhanced login route
router.post('/login',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format'),
      
    body('password')
      .notEmpty().withMessage('Password is required')
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      console.log('[LOGIN] Attempt for:', req.body.email);
      const startTime = Date.now();
      
      await authController.loginUser(req, res);
      
      console.log(`[LOGIN] Completed in ${Date.now() - startTime}ms`);
    } catch (err) {
      console.error('[LOGIN] Route handler error:', err);
      next(err);
    }
  }
);


module.exports = router;