const authorizeRole = (...roles) => {
  try {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Role '${req.user.role}' is not authorized.`,
        });
      }
      next();
    };
  } catch (error) {
    console.log(`Error in authorizing role: ${error.message}`);
    res.status(500).json({
        success: false,
        message: error.message
    })
  }
};

export default authorizeRole;