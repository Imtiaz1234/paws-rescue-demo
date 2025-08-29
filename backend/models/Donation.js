const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  purpose: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: String,
  note: { type: String }, // For transparency logs
  stripeId: { type: String }, // For Stripe mock
});


module.exports = mongoose.model('Donation', donationSchema);
