// Update user name
const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');
exports.updateName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const user = await User.findByIdAndUpdate(req.user.id, { name }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Issue new JWT with updated name
    const payload = { user: { id: user.id, name: user.name, role: user.role, rescueCenter: user.rescueCenter } };
    const token = jwt.sign(payload, secret, { expiresIn: '24h' });
    res.json({ name: user.name, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
const User = require('../models/User');

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.favorites.includes(req.params.catId)) {
      user.favorites.push(req.params.catId);
      await user.save();
    }
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(catId => catId.toString() !== req.params.catId);
    await user.save();
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
