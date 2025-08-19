const mongoose = require('mongoose');

const adoptionApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cat: { type: mongoose.Schema.Types.ObjectId, ref: 'Cat' },
  contactDetails: String,
  homeCheckPassed: Boolean,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdoptionApplication', adoptionApplicationSchema);
