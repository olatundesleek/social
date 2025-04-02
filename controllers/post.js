const addPost = require("../services/post");



async function createPost(req,res) {
   try {
      const user = req.authUser.userId;
      const {  content, hashtags, location, visibility } = req.body;
      const files = req.files
     
      
      
      
      const response = await addPost( content,files, hashtags, location, visibility,user)
     
      res.status(201).json({
         message: response,
        
       });
   } catch (error) {
    
      res.status(500).json({
        message: 'Error creating post',
        error: error.message,
      });
   }
 
   
}

async function getPost(params) {
   console.log("working get");
}


module.exports = {createPost,getPost}