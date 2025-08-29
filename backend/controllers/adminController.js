const RescueCenter = require('../models/RescueCenter');
const User = require('../models/User');
const AdoptionApplication = require('../models/AdoptionApplication');
const Cat = require('../models/Cat');


// Get rescue centers
exports.getRescueCenters = async (req, res) => {
  try {
    const rescueCenters = await RescueCenter.find();
    res.json(rescueCenters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching rescue centers' });
  }
};


// Verify a rescue center - updates verified field to true
exports.verifyRescue = async (req, res) => {
  try {
    const rescueId = req.params.id;

    const updatedRescue = await RescueCenter.findByIdAndUpdate(
      rescueId,
      { verified: true },
      { new: true } // return the updated document
    );

    if (!updatedRescue) {
      return res.status(404).json({ message: 'Rescue center not found' });
    }

    res.json(updatedRescue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error verifying rescue center' });
  }
};


/* Unverify a rescue center - updates verified field to false
exports.unverifyRescue = async (req, res) => {
  try {
    const rescueId = req.params.id;

    const updatedRescue = await RescueCenter.findByIdAndUpdate(
      rescueId,
      { verified: false },
      { new: true } // return the updated document
    );

    if (!updatedRescue) {
      return res.status(404).json({ message: 'Rescue center not found' });
    }

    res.json(updatedRescue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error unverifying rescue center' });
  }
};
*/

// Get users (admin view)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};


// Get cats (admin view)
exports.getCats = async (req, res) => {
  try {
    const cats = await Cat.find()
      .populate({
        path: 'rescueCenter',
        match: { verified: true }
      });
    // Filter out cats whose populated rescueCenter is null (unverified)
    const verifiedCats = cats.filter(cat => cat.rescueCenter != null);
    res.json(verifiedCats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching cats' });
  }
};



// Get adoption applications (admin view)
exports.getAdoptionApplications = async (req, res) => {
  try {
    const applications = await AdoptionApplication.find()
      .populate('cat', 'name')
      .populate('user', 'name email');
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching adoption applications' });
  }
};

// Placeholder for flagged listings
exports.getFlaggedListings = async (req, res) => {
  res.status(501).json({ message: 'Not implemented: getFlaggedListings' });
};


// Placeholder to add a cat
exports.addCat = async (req, res) => {
  res.status(501).json({ message: 'Not implemented: addCat' });
};


// Placeholder to update a cat
exports.updateCat = async (req, res) => {
  res.status(501).json({ message: 'Not implemented: updateCat' });
};


// Placeholder to delete a cat
exports.deleteCat = async (req, res) => {
  res.status(501).json({ message: 'Not implemented: deleteCat' });
};


// Remove the duplicate unverifyRescue function (keep only one)
exports.unverifyRescue = async (req, res) => {
  try {
    const rescueId = req.params.id;
    const updatedRescue = await RescueCenter.findByIdAndUpdate(
      rescueId,
      { verified: false },
      { new: true }
    );

    if (!updatedRescue) {
      return res.status(404).json({ message: 'Rescue center not found' });
    }

    console.log('Backend updated rescue:', updatedRescue);
    res.json(updatedRescue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error unverifying rescue center' });
  }
};

/*
exports.getRescueCenterAdoptions = async (req, res) => {
  try {
    const rescueCenterId = req.user.rescueCenter;
    // Find cats owned by rescue center
    const cats = await Cat.find({ rescueCenter: rescueCenterId }).select('_id');
    const catIds = cats.map(c => c._id);

    // Find adoption applications for these cats
    const applications = await AdoptionApplication.find({ cat: { $in: catIds } })
      .populate('cat', 'name')
      .populate('user', 'name email');

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching adoption applications for rescue center' });
  }
};


*/


/*
exports.unverifyRescue = async (req, res) => {
  try {
    const rescueId = req.params.id;

    const updatedRescue = await RescueCenter.findByIdAndUpdate(
      rescueId,
      { verified: false },
      { new: true }
    );

    if (!updatedRescue) {
      return res.status(404).json({ message: 'Rescue center not found' });
    }

    console.log('Backend updated rescue:', updatedRescue);  // Add this log

    res.json(updatedRescue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error unverifying rescue center' });
  }
};
*/