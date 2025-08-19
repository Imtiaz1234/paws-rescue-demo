const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');
const auth = require('../middleware/auth');
const Cat = require('../models/Cat'); // Make sure to import the Cat model

router.get('/', catController.getCats); // public - filtered list
router.post('/', auth, catController.createCat); // protected - add cat (Rescue/Admin)
router.get('/my-cats', auth, catController.getCatsByRescueCenter); // protected

router.get('/my-cats', auth, async (req, res) => {
  try {
    const cats = await Cat.find({ rescueCenter: req.user.rescueCenter });
    res.json(cats);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching cats for rescue center' });
  }
});

// Add this DELETE route
router.delete('/:id', auth, async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);
    
    if (!cat) {
      return res.status(404).json({ message: 'Cat not found' });
    }
    
    // Check if user owns this cat or is admin
    if (req.user.role !== 'Admin' && cat.rescueCenter.toString() !== req.user.rescueCenter?.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this cat' });
    }
    
    await Cat.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cat deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error deleting cat' });
  }
});
module.exports = router;
