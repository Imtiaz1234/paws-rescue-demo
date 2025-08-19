const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path as needed

// Middleware to check authentication - assume req.user.id is available after auth
const isAuthenticated = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

router.use(isAuthenticated);

// Get favorites
router.get('/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add favorite
router.post('/favorites', async (req, res) => {
  try {
    const { catId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.favorites.includes(catId)) {
      user.favorites.push(catId);
      await user.save();
    }
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove favorite
router.delete('/favorites/:catId', async (req, res) => {
  try {
    const { catId } = req.params;
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(id => id !== catId);
    await user.save();
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
