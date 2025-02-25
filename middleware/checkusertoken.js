const jwt = require("jsonwebtoken");

function checkResetToken(req, res, next) {
  const token = req.body.token;
  console.log(token);

  if (!token) {
    return res.status(400).send("Token is required");
  }

  jwt.verify(token, process.env.PASSWORD_RESET_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid Token");
    }
    req.verifiedUser = decoded;
    next();
  });
}

module.exports = checkResetToken;
