const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Secret key to sign the JWT
let Secret = process.env.SECRET;

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
    //  const token = jwt.sign({ _id: user.id }, Secret);
    //  res.header("authorization", token).status(200).send(token);
    const token = jwt.sign({ username: user.username }, Secret);
    res
      .header("authorization", token)
      .status(200)
      .send("signed in successfully  " + token);

    console.log(token);
  } catch (error) {}
}

module.exports = authUser;
