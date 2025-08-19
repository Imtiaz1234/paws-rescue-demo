const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['User', 'Rescue', 'Admin'], default: 'User' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cat' }],
  rescueCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueCenter' }
});

module.exports = mongoose.model('User', userSchema);
