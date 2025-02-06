const User = require("../models/user.model");
const {
  displayUsers,
  saveUser,
  profile,
  updateProfile,
  uploadUserImage,
} = require("../services/users");

async function getUsers(req, res) {
  const users = await displayUsers();

  res.send(users);
}

function createUser(req, res) {
  const { username, email, password } = req.body;
  saveUser(username, email, password)
    .then(() => res.status(201).send("New user created"))
    .catch((error) => res.status(400).send({ error: error.message }));
}

async function getProfile(req, res) {
  try {
    const username = req.params.username;
    const authUser = req.authUser.username;

    let userInfo = await profile(username, authUser);

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

module.exports = { getUsers, createUser, getProfile, editProfile, uploadImage };
