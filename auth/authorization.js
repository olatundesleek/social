const jwt = require("jsonwebtoken");

// Middleware to verify JWT
async function authUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  // console.log("my token " + authHeader);

  // Check if the Authorization header is present
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1]; // Assuming 'Bearer <token>' format

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "invalid token" });
    }
    // Attach the decoded payload to the request object to track authenticated user
    req.authUser = decoded;
    next();
  });
}

module.exports = { authUser };
