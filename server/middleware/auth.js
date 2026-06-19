const jwt = require("jsonwebtoken");

function auth(req, res, next) {

  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {

    const verified = jwt.verify(token.replace("Bearer ", ""), "secretkey");

    req.user = verified;
    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }

}

module.exports = auth;