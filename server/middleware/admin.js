const jwt = require("jsonwebtoken");

function admin(req, res, next) {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(token, "secretkey");

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Admin only" });
    }

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = admin;