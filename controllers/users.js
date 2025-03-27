const sendEmail = require("../email/sendmail");
const User = require("../models/user.model");
const {
  displayUsers,
  saveUser,
  profile,
  updateProfile,
  passwordResetLink,
  confirmToken,
  changePassword,
  userProfile,
  follow,
  unfollow,
} = require("../services/users");

async function getUsers(req, res) {
  const users = await displayUsers();

  res.send(users);
}

async function createUser(req, res) {
  try {
    const {firstname,lastname,username, email, password } = req.body;
    await saveUser(firstname,lastname,username, email, password);

    res.status(201).send("new user created");
  } catch (error) {
    res.status(403).send({ error: error.message });
  }
}

async function getProfile(req, res) {
  try {
    const authUser = req.authUser.username;

    let userInfo = await profile(authUser);

    res.status(200).send(userInfo);
  } catch (error) {
    res.send(error.message);
  }
}

async function getUserProfile(req, res) {
  console.log("this is the user profile");
  try {
    const username = req.params.username;
    console.log(username);

    let userInfo = await userProfile(username);

    res.status(200).send(userInfo);
  } catch (error) {
    res.send(error.message);
  }
}

async function editProfile(req, res) {
  try {
    const username = req.authUser.username;
    const data = req.body;
    let editedProfile = await updateProfile(username, data);
    res.status(200).send(editedProfile);
  } catch (error) {
    res.send(error.message);
  }
}

async function sendPasswordResetLink(req, res) {
  try {
    const userEmail = req.body.email;
    if (!userEmail) {
      res.status(403).send("include your email");
    }
    const response = await passwordResetLink(userEmail);
    res.status(200).send(response);
  } catch (error) {}
}

async function confirmResetToken(req, res) {
  try {
    const user = req.verifiedUser;

    res.status(200).send(user);
  } catch (error) {
    res.status(403).send(error.message);
  }
}

async function confirmPassword(req, res) {
  try {
    const user = req.verifiedUser.username;
    const pass = req.body.password;
    console.log("na this" + user, pass);

    const response = await changePassword(user, pass);
    res.send(response).status(201);
  } catch (error) {
    res.status(401).send(error);
  }
}

async function uploadImage(req, res) {
  try {
    const username = req.authUser.username;
    newPhoto = "uploads/" + req.file.filename;
    if (!req.file) {
      res.send("no file uploaded");
    }
    await User.findOneAndUpdate(
      { username: username },
      // { profilePicture:  }
      { $push: { pictures: newPhoto } },
      { new: true }
    );
    res.send("file uploaded");
  } catch (error) {
    res.status(403).send(error);
  }
}

async function followUser(req, res) {
  try {
    const authUser = req.authUser.userId;
    const userName = req.authUser.username;
    const userToFollow = req.params.username;
    const response = await follow(userName, authUser, userToFollow);
    res.status(200).send(response);
  } catch (error) {
    res.status(403).send(error.message);
  }
}

async function unfollowUser(req, res) {
  try {
    const authUser = req.authUser.userId;
    const userName = req.authUser.username;
    const userToUnfollow = req.params.username;

    const response = await unfollow(userName, authUser, userToUnfollow);
    res.status(200).send(response);
  } catch (error) {
    res.status(403).send(error.message);
  }
}

module.exports = {
  getUsers,
  createUser,
  getProfile,
  getUserProfile,
  editProfile,
  sendPasswordResetLink,
  confirmResetToken,
  confirmPassword,
  uploadImage,
  followUser,
  unfollowUser,
};
