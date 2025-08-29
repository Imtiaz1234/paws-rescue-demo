const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

module.exports = function(req, res, next) {
  // Debug: Log the Authorization header
  console.log('Authorization header:', req.header('Authorization'));
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, secret);

    // Assuming decoded.user contains the user data from the JWT
    // Add rescueCenter info here—adjust based on your JWT structure
    req.user = {
      ...decoded.user,
      rescueCenter: decoded.user.rescueCenter || decoded.user.rescueCenterId // or whatever key you use
    };

    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(401).json({ message: 'Token is not valid', error: err.message });
  }
};
