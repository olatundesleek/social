// const { log } = require('node:console');
const jwt = require("jsonwebtoken");
const sendEmail = require("../email/sendmail");
const generatePasswordResetEmail = require("../emailtemplate/paswordresetemail");
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

    sendEmail.sendUserRegisterationEmail(username, email);
  } catch (error) {
    // return error;
    throw new Error(error);
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

async function changePassword(user, pass) {
  try {
    const password = await bcrypt.hash(pass, saltRounds);
    const userName = await User.findOneAndUpdate(
      { username: user },
      { $set: { password } }
    );
    sendEmail.sendPasswordChangedEmail(userName.username, userName.email);
    return "password changed successfully";
  } catch (error) {
    throw new Error(error);
  }
}

async function passwordResetLink(userEmail) {
  const email = userEmail;
  console.log(email);
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return `if an account with ${userEmail} exist, you would receive a password reset email`;
    }

    const token = await user.passwordResetToken();

    // passwordReset(token, user);
    sendEmail.sendPasswordResetEmail(token, user, email);
    return `if an account with ${email} exist, you would receive a password reset email`;
  } catch (error) {
    console.log(error);
  }
}

async function confirmToken(token) {
  try {
    const checkToken = new Promise((resolve, reject) => {
      jwt.verify(token, process.env.PASSWORD_RESET_SECRET, (err, decoded) => {
        if (err) {
          throw new Error("invalid Token");
          // reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
    return checkToken;
  } catch (error) {}
}

async function uploadUserImage() {
  // const storage = multer.diskStorage({destination:function (req,file,cb) {
  //   cb(null,)
  // }});
}

module.exports = {
  displayUsers,
  saveUser,
  profile,
  updateProfile,
  uploadUserImage,
  passwordResetLink,
  confirmToken,
  changePassword,
};
