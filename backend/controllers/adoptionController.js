
// Delete an adoption application
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await AdoptionApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    await AdoptionApplication.findByIdAndDelete(id);
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    console.error('Error deleting application:', err);
    res.status(500).json({ message: 'Server error deleting application' });
  }
};
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

    // Check for existing application by this user for this cat
    const existingApp = await AdoptionApplication.findOne({ user: req.user.id, cat });
    if (existingApp) {
      return res.status(400).json({ message: 'You have already applied to adopt this cat.' });
    }

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

    const cat = await Cat.findById(application.cat._id);

    if (status === 'Approved') {
      cat.adoptionStatus = 'Adopted';
      await cat.save();
      console.log(`[AdoptionStatus] Cat ${cat.name} (${cat._id}) set to Adopted after approval.`);
    }

    if (status === 'Rejected') {
      // Check if there are any other approved applications for this cat (excluding this just-rejected application)
      const approvedCount = await AdoptionApplication.countDocuments({
        cat: cat._id,
        status: 'Approved',
        _id: { $ne: application._id }
      });
      if (approvedCount === 0) {
        cat.adoptionStatus = 'Available';
        await cat.save();
        console.log(`[AdoptionStatus] Cat ${cat.name} (${cat._id}) set to Available after rejection (no other approved applications).`);
      } else {
        console.log(`[AdoptionStatus] Cat ${cat.name} (${cat._id}) remains Adopted after rejection (other approved applications exist).`);
      }
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



/*
exports.getAdoptionsForRescue = async (req, res) => {
  try {
    const rescueCenterId = req.user.rescueCenter;

    // Find cats for this rescue center
    const cats = await Cat.find({ rescueCenter: rescueCenterId }).select('_id');
    const catIds = cats.map(cat => cat._id);

    // Find adoption applications for these cats
    const applications = await AdoptionApplication.find({ cat: { $in: catIds } })
      .populate('cat', 'name adoptionStatus')
      .populate('user', 'name email');

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching adoption applications for rescue' });
  }
};
*/


exports.getApplicationsForRescue = async (req, res) => {
  try {
    const rescueCenterId = req.user.rescueCenter;
    const applications = await AdoptionApplication.find()
      .populate({
        path: 'cat',
        match: { rescueCenter: rescueCenterId }
      })
      .populate('user', 'name email');
    
    // Filter out applications where cat is null (not belonging to rescue)
    const filteredApps = applications.filter(app => app.cat != null);
    res.json(filteredApps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching adoption applications for rescue' });
  }
};
