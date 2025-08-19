const RescueCenter = require('../models/RescueCenter');

exports.registerRescue = async (req, res) => {
  try {
    const { name, location, documentUrl } = req.body;
    const rescue = new RescueCenter({ name, location, documentUrl, verified: false });
    await rescue.save();
    res.status(201).json(rescue);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllRescues = async (req, res) => {
  try {
    const rescues = await RescueCenter.find();
    res.json(rescues);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRescueById = async (req, res) => {
  try {
    const rescue = await RescueCenter.findById(req.params.id);
    if (!rescue) return res.status(404).json({ message: "Rescue not found" });
    res.json(rescue);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
