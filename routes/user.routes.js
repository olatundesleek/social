const express = require("express");
const userController = require("../controllers/users"); // Controller functions for user-related actions
const auth = require("../auth/authentication"); // Middleware for user authentication
const { authUser } = require("../auth/authorization"); // Middleware for user authorization
const upload = require("../middleware/upload"); // Middleware for handling file uploads
const checkResetToken = require("../middleware/checkusertoken"); // Middleware to verify password reset token
const axios = require("axios");
const userRouter = express.Router();

// 🔹 Get a user's public profile by their username (requires authentication)
userRouter.get("/user/:username", authUser, userController.getUserProfile);

// 🔹 Get the authenticated user's own profile
userRouter.get("/user/", authUser, userController.getProfile);

userRouter.get("/latestnews/:page?", authUser, userController.getLatestNews);

// 🔹 Update the authenticated user's profile (e.g., name, bio, etc.)
userRouter.patch("/user", authUser, userController.editProfile);

// 🔹 Upload a profile picture (requires authentication & file upload middleware)
userRouter.post(
  "/user/post",
  authUser,
  upload.single("file"),
  userController.uploadImage
);

// 🔹 Register a new user
userRouter.post("/signup", userController.createUser);

// 🔹 User login (handles authentication)
userRouter.post("/signin", auth);

// 🔹 Logout: Clears authentication cookie
userRouter.post("/logout", (req, res) => {
  res.clearCookie("authorization"); // 🔹 Remove the authentication cookie
  res.json({ message: "Logged out successfully!" });
});

// 🔹 Request a password reset link (sends an email)
userRouter.post("/forgot-password", userController.sendPasswordResetLink);

// 🔹 Reset password (requires a valid reset token)
userRouter.post(
  "/reset-password",
  checkResetToken,
  userController.confirmPassword
);

// 🔹 Confirm if a reset token is valid before resetting the password
userRouter.post(
  "/confirm-reset-token",
  checkResetToken,
  userController.confirmResetToken
);

// 🔹 follow a user using thier user id
userRouter.post("/follow/:username", authUser, userController.followUser);
userRouter.post("/unfollow/:username", authUser, userController.unfollowUser);

module.exports = userRouter;
