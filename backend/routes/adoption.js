const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck'); // add this if you have

// User views their adoption applications
router.get('/', auth, adoptionController.getUserApplications);

// User submits adoption application
router.post('/', auth, adoptionController.submitApplication);

// Admin updates adoption application status
router.put('/:id/status', auth, roleCheck('Admin'), adoptionController.updateStatus);

// Rescue and Admin confirm adoption (could be same as updateStatus but with appropriate role)
router.put('/:id/confirm', auth, roleCheck(['Admin', 'Rescue']), adoptionController.confirmAdoption);

module.exports = router;
