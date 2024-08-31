const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt_token;

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized - Missing token" });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);

    if (!data) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid token" });
    }

    req.userID = data.userId;

    next();
  } catch (error) {
    console.log("error in verifyToken ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = verifyToken;
