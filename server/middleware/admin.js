const jwt = require("jsonwebtoken");

function admin(req, res, next) {
  try {
    const authHeader = req.header("Authorization");

    // 1️⃣ Check header exists
    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. No token provided"
      });
    }

    // 2️⃣ Safe token extraction
    let token = authHeader;

    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Invalid token format"
      });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, "secretkey");

    // 4️⃣ Check admin role
    if (!decoded.isAdmin) {
      return res.status(403).json({
        message: "Admin access only"
      });
    }

    // 5️⃣ Attach user to request
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Token expired or invalid"
    });
  }
}

module.exports = admin;