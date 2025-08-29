
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Controllers
const adminController = require('../controllers/adminController'); // for getRescueCenterAdoptions
const adoptionController = require('../controllers/adoptionController'); // for updateStatus


router.put('/:id/status', auth, roleCheck(['Admin', 'Rescue']), adoptionController.updateStatus);

router.get('/rescue-adoptions', auth, roleCheck('Rescue'), adoptionController.getApplicationsForRescue);

// Delete an adoption application (Rescue/Admin)
router.delete('/rescue-adoptions/:id', auth, roleCheck(['Admin', 'Rescue']), adoptionController.deleteApplication);






module.exports = router;
