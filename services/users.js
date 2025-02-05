// const { log } = require('node:console');
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function displayUsers() {
  const allUsers = await User.find();
  return allUsers;
}

async function saveUser(username, email, password) {
  try {
    const hash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username: username,
      email: email,
      password: hash,
    });
    await newUser.save();
    return newUser;
  } catch (error) {
    console.error("Error saving user:", error);
    throw new Error(error); //
  }
}

async function profile(username, authUser) {
  try {
    console.log(authUser, username);

    let user;
    const userInfo = await User.findOne({ username: username }, "-password");

    if (!userInfo) {
      return `user ${username} not found`;
    }
    if (authUser === username) {
      user = {
        username: userInfo.username,
        email: userInfo.email,
        address: userInfo.address,
        profilePic: userInfo.profilePicture,
        bio: userInfo.bio,
        followerCount: userInfo.followersCount,
        followingCount: userInfo.followingCount,
        isVerified: userInfo.isVerified,
        registered: userInfo.accountCreated,
      };
      return user;
    }
    user = {
      username: userInfo.username,
      profilePic: userInfo.profilePicture,
      bio: userInfo.bio,
      followerCount: userInfo.followersCount,
      followingCount: userInfo.followingCount,
      isVerified: userInfo.isVerified,
    };

    return user;
  } catch (error) {
    throw new Error(error);
  }
}

async function updateProfile(username, data) {
  try {
    const updatedUser = User.findOneAndUpdate(
      { username: username },
      { $set: data },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    return error.message;
  }
}
module.exports = { displayUsers, saveUser, profile, updateProfile };
