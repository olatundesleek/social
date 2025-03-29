const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function authUser(req, res) {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).send("incorrect username or password");
    }
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.status(400).send("incorrect username or password");
    }

    const token = await user.createToken();

    res.cookie("authorization", token, {
      httpOnly: true, // Prevents JavaScript access (XSS protection)
      secure: false, // Ensures cookie is sent only over HTTPS (disable in dev if needed)
      sameSite: "Strict", // Prevents CSRF attacks
      maxAge: 3600000, // 1 hour in milliseconds
    });
    if (token) {
      res.status(200).send("user logged in");
    }

    console.log("this is my " + token);
  } catch (error) {}
}

module.exports = authUser;
