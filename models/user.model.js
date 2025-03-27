const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  pictures: {
    type: [String],
  },
  bio: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  accountCreated: {
    type: Date,
    default: Date.now,
  },
});

// Virtual property for follower count
userSchema.virtual("followerCount").get(function () {
  return this.followers.length;
});

// Virtual property for following count
userSchema.virtual("followingCount").get(function () {
  return this.following.length;
});

// method to signin user

userSchema.methods.createToken = async function () {
  let Secret = process.env.SECRET;

  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: this.username, userId: this._id, isAdmin: this.isAdmin },
      Secret,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

userSchema.methods.passwordResetToken = async function () {
  let Secret = process.env.PASSWORD_RESET_SECRET;

  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: this.username },
      Secret,
      { expiresIn: "35m" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

userSchema.methods.verifyToken = async function () {
  let Secret = process.env.SECRET;

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "invalid token" });
    }
  });
};

// Ensure virtuals are included in JSON responses
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.model("social", userSchema, "users");

module.exports = User;
