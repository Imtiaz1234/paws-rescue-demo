const User = require('../models/User');
const RescueCenter = require('../models/RescueCenter');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

exports.register = async (req, res) => {
  const { name, email, password, role, rescueCenterName, location, documentUrl } = req.body;
  try {
    // Check for existing user with this email for all roles
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    let user;
    if (role === 'Rescue') {
      // Create rescue center
      const rescue = new RescueCenter({ name: rescueCenterName, location, documentUrl });
      await rescue.save();

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ name, email, password: hashedPassword, role, rescueCenter: rescue._id });
      await user.save();
    } else {
      // Normal user or admin (admin creation can be manual)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ name, email, password: hashedPassword, role: role || 'User' });
      await user.save();
    }

    const payload = { user: { id: user.id, name: user.name, email: user.email, role: user.role, rescueCenter: user.rescueCenter } };
    const token = jwt.sign(payload, secret, { expiresIn: '24h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const payload = { user: { id: user.id, name: user.name, email: user.email, role: user.role, rescueCenter: user.rescueCenter } };
  const token = jwt.sign(payload, secret, { expiresIn: '24h' });

  res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
