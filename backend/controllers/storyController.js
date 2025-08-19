const Story = require('../models/Story');

exports.createStory = async (req, res) => {
  try {
    const { title, content } = req.body;
    const story = new Story({ title, content, rescueCenter: req.user.rescueCenter });
    await story.save();
    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find().populate('rescueCenter', 'name');
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
