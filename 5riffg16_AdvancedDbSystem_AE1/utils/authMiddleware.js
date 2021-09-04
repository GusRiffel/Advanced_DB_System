const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect("/?message=Access denied. You need to be Logged in.");
  }
  next();
};

module.exports = authMiddleware;