const { ObjectId } = require("mongodb");
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

async function profile(authUser) {
  try {
    let user;
    const userInfo = await User.findOne({ username: authUser }, "-password");

    if (!userInfo) {
      return `user ${username} not found`;
    }

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
  } catch (error) {
    throw new Error(error);
  }
}
async function userProfile(username) {
  try {
    let user;
    const userInfo = await User.findOne({ username: username }, "-password");

    if (!userInfo) {
      return `user ${username} not found`;
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

async function follow(userName, authUser, userToFollow) {
  const userId = authUser;
  const session = await User.startSession(); // Start a session for the transaction

  try {
    session.startTransaction(); // Begin transaction

    if (userName === userToFollow) {
      throw new Error("You cannot follow yourself");
    }

    // 🔹 Step 1: Check if the target user exists within the transaction
    const targetUser = await User.findOne({ username: userToFollow }).session(
      session
    );

    if (!targetUser) {
      throw new Error("User not found");
    }

    if (targetUser.followers.includes(userId)) {
      throw new Error("You are already following this user");
    }

    // 🔹 Step 2: Perform updates atomically within the transaction

    await User.updateOne(
      { username: userToFollow },
      { $addToSet: { followers: new ObjectId(userId) } },
      { session } // Perform within the session
    );

    await User.updateOne(
      { _id: userId },
      { $addToSet: { following: new ObjectId(targetUser._id) } },
      { session }
    );

    // 🔹 Step 3: Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Successfully followed the user" };
  } catch (error) {
    await session.abortTransaction(); // Rollback any changes
    session.endSession();
    return { success: false, message: error.message };
  }
}

async function unfollow(userName, authUser, userToUnfollow) {
  const userId = authUser;
  const session = await User.startSession(); // Start a session for the transaction

  try {
    session.startTransaction(); // Begin transaction

    if (userName === userToUnfollow) {
      throw new Error("You cannot unfollow yourself");
    }

    // 🔹 Step 1: Check if the target user exists within the transaction
    const targetUser = await User.findOne({ username: userToUnfollow }).session(
      session
    );

    if (!targetUser) {
      throw new Error("User not found");
    }

    if (!targetUser.followers.includes(userId)) {
      throw new Error("You are not following this user");
    }

    // 🔹 Step 2: Perform updates atomically within the transaction

    await User.updateOne(
      { username: userToUnfollow },
      { $pull: { followers: new ObjectId(userId) } }, // Remove userId from followers
      { session } // Perform within the session
    );

    await User.updateOne(
      { _id: userId },
      { $pull: { following: new ObjectId(targetUser._id) } }, // Remove targetUser from following
      { session }
    );

    // 🔹 Step 3: Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Successfully unfollowed the user" };
  } catch (error) {
    await session.abortTransaction(); // Rollback any changes
    session.endSession();
    return { success: false, message: error.message };
  }
}

module.exports = {
  displayUsers,
  saveUser,
  profile,
  userProfile,
  updateProfile,
  uploadUserImage,
  passwordResetLink,
  confirmToken,
  changePassword,
  follow,
  unfollow,
};
