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
