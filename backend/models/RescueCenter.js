const mongoose = require('mongoose');

const rescueCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  isPublished: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  cats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cat' }],
  email: { type: String, required: false }, // Add email field for notification
});

module.exports = mongoose.model('RescueCenter', rescueCenterSchema);
