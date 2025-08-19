const AdoptionApplication = require('../models/AdoptionApplication');
const mailer = require('../utils/mailer');
const User = require('../models/User');
exports.getUserApplications = async (req, res) => {
  try {
    const apps = await AdoptionApplication.find({ user: req.user.id }).populate('cat');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.submitApplication = async (req, res) => {
  try {
    const { cat, contactDetails, homeCheckPassed } = req.body;
    const application = new AdoptionApplication({
      user: req.user.id,
      cat,
      contactDetails,
      homeCheckPassed,
      status: 'Pending'
    });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.updateStatus = async (req, res) => {
  // Update status logic...

  // After saving application:
  const appUser = await User.findById(application.user);
  if (appUser) {
    await mailer.sendEmail(
      appUser.email,
      'Adoption Status Update',
      `Your adoption application status changed to: ${application.status}`
    );
  }
  res.json(application);
};
