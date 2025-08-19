const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cat = require('../models/Cat');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/auth');
const adminRoleCheck = require('../middleware/roleCheck');

// Get user favorites with full cat data
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favorites',
      match: { adoptionStatus: 'Available' },
      populate: {
        path: 'rescueCenter',
        select: 'name location verified'
      }
    });
    
    res.json(user.favorites || []);
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add to favorites
router.post('/favorites/:catId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const cat = await Cat.findById(req.params.catId);
    
    if (!cat) {
      return res.status(404).json({ message: 'Cat not found' });
    }

    // Check if already favorited
    if (!user.favorites.includes(req.params.catId)) {
      user.favorites.push(req.params.catId);
      await user.save();
    }

    // Return success message
    res.json({ message: 'Added to favorites', success: true });
  } catch (err) {
    console.error('Error adding favorite:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove from favorites
router.delete('/favorites/:catId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Remove the cat ID from favorites array
    user.favorites = user.favorites.filter(
      catId => catId.toString() !== req.params.catId
    );
    
    await user.save();
    res.json({ message: 'Removed from favorites', success: true });
  } catch (err) {
    console.error('Error removing favorite:', err);
    res.status(500).json({ message: "Server error" });
  }
});


// Example Express route for deleting user
router.delete('/api/admin/users/:id', authMiddleware, adminRoleCheck, async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

module.exports = router;