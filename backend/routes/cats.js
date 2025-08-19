const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');
const auth = require('../middleware/auth');

router.get('/', catController.getCats); // public - filtered list
router.post('/', auth, catController.createCat); // protected - add cat (Rescue/Admin)
router.get('/my-cats', auth, catController.getCatsByRescueCenter); // protected

module.exports = router;
