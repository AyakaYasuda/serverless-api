const jwt = require("jsonwebtoken");

const generateToken = userInfo => {
  if (!userInfo) {
    return null;
  }

  return jwt.sign(userInfo, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const verifyToken = (username, token) => {
  return jwt.verify(token, process.env.JWT_SECRET, (error, response) => {
    if (error) {
      return {
        verified: false,
        message: "Invalid token",
      };
    }

    if (response.username !== username) {
      return {
        verified: false,
        massage: "Invalid user",
      };
    }

    return { verified: true, message: "Verified" };
  });
};

module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;
