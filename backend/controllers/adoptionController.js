const AdoptionApplication = require('../models/AdoptionApplication');
const Cat = require('../models/Cat');                                      // Added: import Cat model
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

    // Update cat adoptionStatus to 'Pending' if currently 'Available'
    const catDoc = await Cat.findById(cat);
    if (catDoc.adoptionStatus === 'Available') {
      catDoc.adoptionStatus = 'Pending';
      await catDoc.save();
    }

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find and update the application
    const application = await AdoptionApplication.findById(id)
      .populate('cat', 'name')    // Only populate cat name for email
      .populate('user', 'email name');  // Only populate user email and name

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    // If status is approved, update cat adoptionStatus to 'Adopted'
    if (status === 'Approved') {
      const cat = await Cat.findById(application.cat._id);
      cat.adoptionStatus = 'Adopted';
      await cat.save();
    }

    // Send email notification
    if (application.user && application.user.email) {
      try {
        await mailer.sendAdoptionStatusEmail(
          application.user.email,
          status,
          application.cat?.name || 'a cat'
        );
        console.log(`Status update email sent to ${application.user.email}`);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail request on email failure
      }
    }

    res.json(application);
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ message: "Server error" });
  }
};
