const Cat = require('../models/Cat');

exports.getCats = async (req, res) => {
  try {
    const filter = {};

    // Age filter (number)
    if (req.query.age) {
      const ageNum = Number(req.query.age);
      if (!isNaN(ageNum)) {
        filter.age = ageNum;
      }
    }

    // Location filter (partial string)
    if (req.query.location) {
      filter.location = { $regex: new RegExp(req.query.location, 'i') };
    }

    // SpecialNeeds filter (partial string)
    if (req.query.specialNeeds) {
      filter.specialNeeds = { $regex: new RegExp(req.query.specialNeeds, 'i') };
    }

    // Lookup verified rescue centers and filter by rescueCenter name if provided
    const aggregatePipeline = [
      {
        $lookup: {
          from: 'rescuecenters',
          localField: 'rescueCenter',
          foreignField: '_id',
          as: 'rescueCenter'
        }
      },
      { $unwind: '$rescueCenter' },
      { $match: { 'rescueCenter.verified': true } }
    ];

    if (req.query.rescueCenter) {
      aggregatePipeline.push({
        $match: {
          'rescueCenter.name': { $regex: new RegExp(req.query.rescueCenter, 'i') }
        }
      });
    }

    if (Object.keys(filter).length > 0) {
      aggregatePipeline.push({ $match: filter });
    }

    const cats = await Cat.aggregate(aggregatePipeline);
    res.json(cats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching cats' });
  }
};

exports.createCat = async (req, res) => {
  if (req.user.role !== 'Rescue' && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  try {
    const catData = req.body;

    // Assign rescueCenter automatically from logged-in user
    catData.rescueCenter = req.user.rescueCenter;

    const cat = new Cat(catData);
    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCatsByRescueCenter = async (req, res) => {
  const rescueCenterId = req.user.rescueCenter;
  try {
    const cats = await Cat.find({ rescueCenter: rescueCenterId });
    res.json(cats);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching cats for rescue center' });
  }
};
