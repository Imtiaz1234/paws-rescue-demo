const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  purpose: String, // e.g., "$200 for vaccines"
  date: { type: Date, default: Date.now },
  status: String
});


module.exports = mongoose.model('Donation', donationSchema);
