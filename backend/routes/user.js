const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

router.use(auth);

router.get('/favorites', userController.getFavorites);
router.post('/favorites/:catId', userController.addFavorite);
router.delete('/favorites/:catId', userController.removeFavorite);

module.exports = router;
