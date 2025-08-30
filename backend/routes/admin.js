
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const User = require('../models/User'); // Add User model here for delete route
//const authMiddleware = require('../middleware/auth');
//const adminRoleCheck = require('../middleware/roleCheck');

// Admin deletes an adoption application
router.delete('/adoptions/:id', auth, roleCheck('Admin'), adminController.deleteAdoptionApplication);



// Test route to check if admin routes are working and accessible
router.get('/test', (req, res) => {
  res.json({ message: 'Admin route is working' });
});

// Apply authentication and admin role check middleware after test route
router.use(auth);
router.use(roleCheck('Admin'));

router.post('/verify-rescue/:id', adminController.verifyRescue);

router.get('/flagged-listings', adminController.getFlaggedListings);
router.get('/users', adminController.getUsers);

// New routes for admin adoption applications and cats management
router.get('/adoptions', adminController.getAdoptionApplications);
router.get('/cats', adminController.getCats);
router.post('/cats', adminController.addCat);
router.put('/cats/:id', adminController.updateCat);
router.delete('/cats/:id', adminController.deleteCat);
router.get('/rescue-centers', adminController.getRescueCenters);
router.post('/unverify-rescue/:id', adminController.unverifyRescue);


// Updated DELETE user route with middleware to protect the route
router.delete('/users/:id', auth, roleCheck('Admin'), async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error deleting user' });
  }
});

module.exports = router;
