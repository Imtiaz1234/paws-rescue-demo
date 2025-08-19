const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: String,
  content: String,
  rescueCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueCenter' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', storySchema);
