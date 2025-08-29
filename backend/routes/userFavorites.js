const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path as needed
const auth = require('../middleware/auth');

// Use JWT auth middleware to set req.user
router.use(auth);

// Debug: Log when favorites route is hit
console.log('userFavorites.js: Favorites route file loaded');
// Get favorites (populated)
router.get('/favorites', async (req, res) => {
  console.log('GET /api/user/favorites route hit, req.user:', req.user);
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add favorite (return populated)
router.post('/favorites', async (req, res) => {
  try {
    const { catId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.favorites.includes(catId)) {
      user.favorites.push(catId);
      await user.save();
    }
    await user.populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove favorite (return populated)
router.delete('/favorites/:catId', async (req, res) => {
  try {
    const { catId } = req.params;
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(id => id.toString() !== catId);
    await user.save();
    await user.populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
