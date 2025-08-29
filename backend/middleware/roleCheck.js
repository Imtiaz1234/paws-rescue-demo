module.exports = function(requiredRoles) {
  return (req, res, next) => {
    if (Array.isArray(requiredRoles)) {
      if (!requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else {
      if (req.user.role !== requiredRoles) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    next();
  };
};
