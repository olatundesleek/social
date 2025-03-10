const express = require('express')
const { authUser } = require("../auth/authorization"); // Middleware for user authorization
const postController = require('../controllers/post');
// const userController = require("../controllers/users"); // Controller functions for user-related actions


const postRouter = express.Router()



// 🔹 Get a user's public profile by their username (requires authentication)
postRouter.post("/post", authUser, postController.createPost);
postRouter.get("/post", authUser, postController.getPost);

// postRoutes.post("/post",authUser,createPost)


module.exports = postRouter