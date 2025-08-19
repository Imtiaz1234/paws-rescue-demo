const express = require('express');
const router = express.Router();
const rescueController = require('../controllers/rescueController');
const auth = require('../middleware/auth');

router.post('/register', rescueController.registerRescue);
router.get('/', rescueController.getAllRescues);
router.get('/:id', rescueController.getRescueById);

module.exports = router;
