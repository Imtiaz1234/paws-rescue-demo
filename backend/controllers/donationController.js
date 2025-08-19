const Donation = require('../models/Donation');
const stripeMock = require('../utils/stripeMock');

exports.getPublicDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate('donor', 'name');
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