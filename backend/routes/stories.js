const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const auth = require('../middleware/auth');

router.get('/', storyController.getStories);
router.post('/', auth, storyController.createStory);

module.exports = router;
