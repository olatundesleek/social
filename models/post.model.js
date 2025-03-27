const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a Schema for Post
const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxLength: 500, // Limit to the maximum characters you want
    },
    media: [
      {
        url: { type: String, required: false }, // URL of the media (image, video, etc.)
        type: { type: String, enum: ['image', 'video', 'audio'], required: false }, // Media type
        description: { type: String, required: false }, // Optional description of the media
      },
    ],
    hashtags: [
      {
        type: String,
      },
    ],
    likes: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' }, // User who liked the post
        timestamp: { type: Date, default: Date.now }, // Timestamp for when the post was liked
      },
    ],
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' }, // User who commented
        content: { type: String, required: true }, // Content of the comment
        timestamp: { type: Date, default: Date.now }, // Timestamp when the comment was made
        replies: [
          {
            user: { type: Schema.Types.ObjectId, ref: 'User' }, // User who replied
            content: { type: String, required: true }, // Content of the reply
            timestamp: { type: Date, default: Date.now }, // Timestamp when the reply was made
            parentCommentId: { type: Schema.Types.ObjectId, ref: 'Comment' }, // Target comment for the reply
          },
        ],
      },
    ],
    location: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'friends', 'followers'], // Who can see the post
      default: 'public',
    },
    tags: [
      {
        type: String, // You can tag users or other entities
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now, // The post creation timestamp
    },
    updatedAt: {
      type: Date,
      default: Date.now, // The timestamp for when the post was last updated
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Virtual for likes count
postSchema.virtual('likesCount').get(function () {
  return this.likes.length;
});

// Virtual for comments count
postSchema.virtual('commentsCount').get(function () {
  return this.comments.length;
});

// Create a model for the post
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
