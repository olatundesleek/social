const makePost = require("../services/post")


async function createPost(req,res) {
   const response = await makePost()
   console.log("working make");
   
}

async function getPost(params) {
   console.log("working get");
}


module.exports = {createPost,getPost}