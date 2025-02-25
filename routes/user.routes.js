const express = require("express");
const userController = require("../controllers/users");
const auth = require("../auth/authentication");
const { authUser } = require("../auth/authorization");
const upload = require("../middleware/upload");
const checkResetToken = require("../middleware/checkusertoken");

const userRouter = express.Router();

userRouter.get("/", userController.getUsers);

userRouter.get("/profile/:username", authUser, userController.getProfile);

userRouter.put("/profile/update", authUser, userController.editProfile);

userRouter.post(
  "/profile/update/upload",
  authUser,
  upload.single("file"),
  userController.uploadImage
);
userRouter.post("/signup", userController.createUser);
userRouter.post("/signin", auth);
userRouter.post("/forgot-password", userController.sendPasswordResetLink);
userRouter.post(
  "/reset-password",
  checkResetToken,
  userController.confirmPassword
);
// userRouter.post("/reset-password", userController.passwordReset);
userRouter.post(
  "/confirm-reset-token",
  checkResetToken,
  userController.confirmResetToken
);
module.exports = userRouter;
