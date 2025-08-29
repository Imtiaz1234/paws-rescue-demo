
// Admin: Add/edit note for donation transparency
exports.addOrEditNote = async (req, res) => {
  try {
    const { note } = req.body;
    const donation = await Donation.findByIdAndUpdate(req.params.id, { note }, { new: true });
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
const Donation = require('../models/Donation');
const stripeMock = require('../utils/stripeMock');


exports.getPublicDonations = async (req, res) => {
  try {
    // Try to get user role from JWT if present
    let isAdmin = false;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const jwt = require('jsonwebtoken');
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        isAdmin = decoded.user && decoded.user.role === 'Admin';
      } catch {}
    }
    let donations = await Donation.find().populate('donor', 'name');
    if (!isAdmin) {
      // Remove donor info for non-admins
      donations = donations.map(d => {
        const { donor, ...rest } = d.toObject();
        return rest;
      });
    }
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.makeDonation = async (req, res) => {
  try {
    const { amount, purpose, paymentInfo } = req.body;

    const charge = await stripeMock.charge(amount, paymentInfo);
    if (charge.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment failed' });
    }

    const donation = new Donation({
      donor: req.user.id,
      amount,
      purpose,
      status: 'Completed'
    });
    await donation.save();
    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.getDonationUsage = async (req, res) => {
  try {
    const donations = await Donation.aggregate([
      {
        $group: {
          _id: '$purpose',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};