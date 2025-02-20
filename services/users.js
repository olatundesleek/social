// const { log } = require('node:console');

const sendEmail = require("../email/sendmail");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const link = process.env.WEBLINK;
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
async function passwordReset(userEmail) {
  const email = userEmail;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return `if an account with ${userEmail} exist, you would receive a password reset email`;
    }

    const token = await user.passwordResetToken();
    const subject = "passwordreset";
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
        }
        .container {
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            margin: auto;
        }
        .button {
            display: inline-block;
            background: #007bff;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 10px;
        }
        .button:hover {
            background: #0056b3;
        }
        p {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>Hello <strong>User</strong>,</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <a href="http://${link}${token}" class="button">Reset Password</a>
        <p>If you didn't request this, you can ignore this email.</p>
        <p>Thanks, <br> The Team</p>
    </div>
</body>
</html>`;
    // const userEmail = email;
    sendEmail(subject, html, userEmail);
  } catch (error) {
    console.log(error);
  }
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
  passwordReset,
};
