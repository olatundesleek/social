const User = require("../models/user.model");
const Post = require("../models/post.model");

 // Service function to create a post
async function addPost(content,file, hashtags, location, visibility,user) {
 
    
    console.log("your id "+user);
    
      try {
       
    
        // If media is included in the request, use Multer's array() to handle multiple files
        if (file && file.length > 0) {
          const mediaFiles = file.map(file => {
            return {
              url: file.path,
              Type: file.mimetype,
              filename: file.filename,
              
            };
          });
    
          // Create new post document
          const newPost = new Post({
            user,
            content,
            hashtags: hashtags.split(','),
            location,
            visibility,
            media: mediaFiles,
          });
    
          // Save post to MongoDB
          await User.updateOne(
            { id: user },
            { $addToSet: { pictures:mediaFiles } },
            // { session } // Perform within the session
          );
          await newPost.save();
    
          // Send success response
         return ({
            message: 'Post created successfully!',
            post: newPost,
          });
        } else {
          // If no media, just create post with other details
          const newPost = new Post({
            user,
            content,
            hashtags: hashtags.split(','),
            location,
            visibility,
            media: [],
          });
    
          await newPost.save();
    
        return  'Post created successfully without media!';
         
        }
      } catch (error) {
      throw new Error(error);
      
      }
    };
    
 
    module.exports = addPost
    
    



    



module.exports = addPost


