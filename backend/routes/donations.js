const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const auth = require('../middleware/auth');


// Public logs
router.get('/', donationController.getPublicDonations); // public logs
// Make a donation
router.post('/', auth, donationController.makeDonation);
// Admin: Add/edit note for donation transparency
router.patch('/:id/note', auth, donationController.addOrEditNote);

module.exports = router;
