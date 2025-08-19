const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');
const auth = require('../middleware/auth');

router.get('/', auth, adoptionController.getUserApplications);
router.post('/', auth, adoptionController.submitApplication);
router.put('/:id/status', auth, adoptionController.updateStatus); // Admin updates

module.exports = router;
