const express = require("express");
const userController = require("../controllers/users");
const auth = require("../auth/authentication");
const { authUser } = require("../auth/authorization");
const upload = require("../middleware/upload");

const userRouter = express.Router();

userRouter.get("/", userController.getUsers);

userRouter.get("/profile/:username", authUser, userController.getProfile);

userRouter.put("/profile/update", authUser, userController.editProfile);

userRouter.post(
  "/profile/update/upload",
  authUser,
  upload.single("picture"),
  userController.uploadImage
);
userRouter.post("/signup", userController.createUser);
userRouter.post("/signin", auth);
module.exports = userRouter;
