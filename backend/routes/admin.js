const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
//console.log('Exports from adminController:', Object.keys(adminController));
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

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



module.exports = router;
