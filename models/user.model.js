const moogoose = require("mongoose");
const { array } = require("../middleware/upload");

const userSchema = new moogoose.Schema({
  username: {
    type: String,
    required: true, // Ensures username is mandatory
    unique: true, // Ensures usernames are unique
  },
  email: {
    type: String,
    required: true, // Ensures email is mandatory
    unique: true, // Ensures no duplicate emails
    match: [/.+@.+\..+/, "Please enter a valid email"], // Validates email format
  },
  password: {
    type: String,
    required: true, // Ensures password is mandatory
  },
  profilePicture: {
    type: String,
    default: "", // Default value if no profile picture is provided
  },
  pictures: {
    type: [String],
    // Default value if no profile picture is provided
  },
  bio: {
    type: String,
    default: "", // Default value if no bio is provided
  },
  address: {
    type: String,
    default: "", // Default value if no address is provided
  },
  followersCount: {
    type: Number,
    default: 0, // Default value if no followers
  },
  followingCount: {
    type: Number,
    default: 0, // Default value if no following
  },
  isVerified: {
    type: Boolean,
    default: false, // Default to unverified accounts
  },
  accountCreated: {
    type: Date,
    default: Date.now, // Automatically sets the creation timestamp
  },
});

const User = moogoose.model("social", userSchema, "users");

module.exports = User;
